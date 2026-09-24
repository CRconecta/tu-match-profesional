import dns from "node:dns/promises";
import net from "node:net";

export type JobOffer = {
  sourceType: "url";
  sourceUrl: string;
  offerText: string;
  sourceName: string;
  title: string;
  company: string;
  location: string;
  modality: string;
  description: string;
  responsibilities: string;
  requirements: string;
  education: string;
  experience: string;
  skills: string;
  benefits: string;
  extractionStatus: "success" | "insufficient" | "blocked";
};

type PortalExtractor = (document: string, pageUrl: URL) => Partial<JobOffer>;

const MAX_REDIRECTS = 3;
const MAX_RESPONSE_BYTES = 2 * 1024 * 1024;
const FETCH_TIMEOUT_MS = 8000;
const portalNames: Record<string, string> = { "linkedin.com": "LinkedIn", "computrabajo.com": "Computrabajo", "indeed.com": "Indeed", "bumeran.com.ar": "Bumeran", "zonajobs.com.ar": "ZonaJobs" };

const genericExtractor: PortalExtractor = (document, pageUrl) => {
  const jsonLd = [...document.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)].map((match) => { try { return JSON.parse(match[1]); } catch { return null; } }).flatMap((item) => Array.isArray(item) ? item : [item]).find((item) => item && (item["@type"] === "JobPosting" || item["@type"]?.includes?.("JobPosting")));
  const text = htmlToText(document);
  const title = clean(jsonLd?.title || metaContent(document, "og:title") || tagContent(document, "title"));
  const company = clean(jsonLd?.hiringOrganization?.name || metaContent(document, "author") || labeledValue(text, /empresa|company/i));
  const location = clean(jsonLd?.jobLocation?.address?.addressLocality || jsonLd?.jobLocation?.address?.addressRegion || labeledValue(text, /ubicación|ubicacion|location/i));
  const description = clean(jsonLd?.description || text);
  const responsibilities = clean(jsonLd?.responsibilities || sectionValue(text, /responsabilidades|tareas principales/i));
  const requirements = clean(jsonLd?.qualifications || sectionValue(text, /requisitos|requerimientos/i));
  const education = clean(sectionValue(text, /formación|formacion|educación|educacion/i));
  const experience = clean(sectionValue(text, /experiencia requerida|experiencia/i));
  const benefits = clean(jsonLd?.jobBenefits || sectionValue(text, /beneficios|benefits/i));
  const skills = clean(jsonLd?.skills || sectionValue(text, /conocimientos|herramientas|skills/i));
  const modality = clean(labeledValue(text, /modalidad|jornada|workplace/i));
  return { sourceUrl: pageUrl.toString(), title, company, location, modality, description, responsibilities, requirements, education, experience, skills, benefits };
};

const extractors: Array<{ matches: (hostname: string) => boolean; extract: PortalExtractor }> = [{ matches: () => true, extract: genericExtractor }];

export function validatePublicUrl(value: string): URL {
  let url: URL;
  try { url = new URL(value); } catch { throw new Error("La URL no es válida."); }
  if (!["http:", "https:"].includes(url.protocol)) throw new Error("Solo se permiten URLs http o https.");
  if (url.username || url.password) throw new Error("La URL no puede incluir credenciales.");
  return url;
}

function isPrivateAddress(address: string) {
  if (net.isIPv4(address)) { const octets = address.split(".").map(Number); return octets[0] === 10 || octets[0] === 127 || (octets[0] === 172 && octets[1] >= 16 && octets[1] <= 31) || (octets[0] === 192 && octets[1] === 168) || octets[0] === 0 || octets[0] >= 224; }
  if (net.isIPv6(address)) { const normalized = address.toLowerCase(); return normalized === "::1" || normalized === "::" || normalized.startsWith("fc") || normalized.startsWith("fd") || /^fe[89ab]/.test(normalized); }
  return true;
}

async function assertPublicHost(url: URL) {
  if (net.isIP(url.hostname) && isPrivateAddress(url.hostname)) throw new Error("No se puede acceder a direcciones internas.");
  const addresses = await dns.lookup(url.hostname, { all: true });
  if (!addresses.length || addresses.some(({ address }) => isPrivateAddress(address))) throw new Error("El destino no es público.");
}

async function fetchPublicPage(initialUrl: URL) {
  let url = initialUrl;
  for (let attempt = 0; attempt <= MAX_REDIRECTS; attempt += 1) {
    await assertPublicHost(url);
    const response = await fetch(url, { redirect: "manual", signal: AbortSignal.timeout(FETCH_TIMEOUT_MS), headers: { Accept: "text/html,application/xhtml+xml", "User-Agent": "TuMatchProfesional/1.0" } });
    if (response.status >= 300 && response.status < 400) { const location = response.headers.get("location"); if (!location || attempt === MAX_REDIRECTS) throw new Error("No pudimos seguir el aviso público."); url = validatePublicUrl(new URL(location, url).toString()); continue; }
    if (!response.ok) throw new Error("El aviso no está disponible públicamente.");
    const contentType = response.headers.get("content-type") || "";
    if (!contentType.includes("text/html") && !contentType.includes("application/xhtml+xml")) throw new Error("El contenido no es una página pública legible.");
    const reader = response.body?.getReader(); if (!reader) throw new Error("No pudimos leer el aviso.");
    const chunks: Uint8Array[] = []; let total = 0;
    while (true) { const { done, value } = await reader.read(); if (done) break; total += value.byteLength; if (total > MAX_RESPONSE_BYTES) throw new Error("El aviso es demasiado grande para leerlo automáticamente."); chunks.push(value); }
    return { html: Buffer.concat(chunks).toString("utf8"), url };
  }
  throw new Error("No pudimos leer el aviso.");
}

export async function extractJobOffer(sourceUrl: string): Promise<JobOffer> {
  const initialUrl = validatePublicUrl(sourceUrl);
  try {
    const { html, url } = await fetchPublicPage(initialUrl);
    const hostname = url.hostname.replace(/^www\./, "");
    const extractor = extractors.find(({ matches }) => matches(hostname))?.extract || genericExtractor;
    const extracted = extractor(html, url);
    const normalized = { ...extracted, sourceType: "url" as const, sourceUrl: initialUrl.toString(), offerText: "", sourceName: portalNames[hostname] || hostname, title: "", company: "", location: "", modality: "", description: "", responsibilities: "", requirements: "", education: "", experience: "", skills: "", benefits: "", extractionStatus: "insufficient" as const };
    const offerText = buildOfferText(normalized);
    if (offerText.length < 80) return { ...normalized, offerText, extractionStatus: "insufficient" };
    return { ...normalized, offerText, extractionStatus: "success" };
  } catch (error) {
    console.warn("Public job offer extraction failed", error instanceof Error ? error.message : error);
    return { sourceType: "url", sourceUrl: initialUrl.toString(), offerText: "", sourceName: portalNames[initialUrl.hostname.replace(/^www\./, "")] || initialUrl.hostname, title: "", company: "", location: "", modality: "", description: "", responsibilities: "", requirements: "", education: "", experience: "", skills: "", benefits: "", extractionStatus: "blocked" };
  }
}

function buildOfferText(offer: Partial<JobOffer>) { return [offer.title && `Título: ${offer.title}`, offer.company && `Empresa: ${offer.company}`, offer.location && `Ubicación: ${offer.location}`, offer.modality && `Modalidad: ${offer.modality}`, offer.description, offer.responsibilities && `Responsabilidades: ${offer.responsibilities}`, offer.requirements && `Requisitos: ${offer.requirements}`, offer.education && `Formación: ${offer.education}`, offer.experience && `Experiencia: ${offer.experience}`, offer.skills && `Conocimientos y herramientas: ${offer.skills}`, offer.benefits && `Beneficios: ${offer.benefits}`].filter(Boolean).join("\n\n").slice(0, 20000); }

function htmlToText(html: string) { return decodeEntities(html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<noscript[\s\S]*?<\/noscript>/gi, " ").replace(/<!--[\s\S]*?-->/g, " ").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim()); }
function clean(value: unknown) { return typeof value === "string" ? decodeEntities(value.replace(/\s+/g, " ").trim()).slice(0, 12000) : ""; }
function decodeEntities(value: string) { return value.replace(/&nbsp;/gi, " ").replace(/&amp;/gi, "&").replace(/&quot;/gi, '"').replace(/&#39;|&apos;/gi, "'").replace(/&lt;/gi, "<").replace(/&gt;/gi, ">"); }
function metaContent(html: string, key: string) { return html.match(new RegExp(`<meta[^>]+(?:property|name)=["']${key}["'][^>]+content=["']([^"']+)["']`, "i"))?.[1] || ""; }
function tagContent(html: string, tag: string) { return html.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i"))?.[1] || ""; }
function labeledValue(text: string, label: RegExp) { return text.match(new RegExp(`${label.source}\\s*[:\\-]\\s*([^|.;]{2,100})`, "i"))?.[1] || ""; }
function sectionValue(text: string, heading: RegExp) { return text.match(new RegExp(`${heading.source}\\s*[:\\-]?\\s*(.{20,500})`, "i"))?.[1] || ""; }