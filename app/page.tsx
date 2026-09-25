"use client";

import { ChangeEvent, FormEvent, useState } from "react";

type Analysis = { score: number; summary: string; strengths: string[]; gaps: string[]; missingKeywords: string[]; relevantExperience: string[]; recommendations: string[]; highlight: string[]; cvFileName: string; sourceType?: "url" | "manual"; sourceUrl?: string | null; sourceName?: string | null; offerText?: string };
type JobOfferPreview = { sourceType: "url"; sourceUrl: string; offerText: string; sourceName: string; title: string; company: string; location: string; modality: string; description: string; responsibilities: string; requirements: string; education: string; experience: string; skills: string; benefits: string; extractionStatus: "success" | "insufficient" | "blocked" };
const LINKEDIN_PERSONAL_URL = "https://www.linkedin.com/in/carla-rodriguez-rrhh/";
const LINKEDIN_COMPANY_URL = "https://www.linkedin.com/company/cr-gestionconresultados/";
const WHATSAPP_NUMBER = "5491124895402";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hola Carla, utilicé Tu Match Profesional y quisiera consultar por el servicio de asesoramiento de empleabilidad.")}`;
const URL_EXTRACTION_FALLBACK = "No pudimos leer automáticamente este aviso. Pegá el texto completo de la oferta y continuamos con el análisis.";
const allowedTypes = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "text/plain"];

function isPublicHttpUrl(value: string) {
  try { return ["http:", "https:"].includes(new URL(value).protocol); } catch { return false; }
}

export default function Home() {
  const [jobDescription, setJobDescription] = useState("");
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sourceUrl, setSourceUrl] = useState("");
  const [offerPreview, setOfferPreview] = useState<JobOfferPreview | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    setError(""); setAnalysis(null);
    if (!file) { setCvFile(null); return; }
    const extension = file.name.toLowerCase().slice(file.name.lastIndexOf("."));
    if (!allowedTypes.includes(file.type) && ![".pdf", ".docx", ".txt"].includes(extension)) { setCvFile(null); setError("El archivo no es válido. Subí tu CV en formato PDF, DOCX o TXT."); return; }
    if (file.size > 8 * 1024 * 1024) { setCvFile(null); setError("El CV supera el límite de 8 MB. Elegí un archivo más liviano."); return; }
    setCvFile(file);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(""); setAnalysis(null);
    if (!jobDescription.trim()) { setError("Pegá el texto completo del aviso laboral para comenzar."); return; }
    if (!cvFile) { setError("Cargá tu CV en PDF, DOCX o TXT para poder analizarlo."); return; }
    setIsLoading(true);
    try {
      let offerText = jobDescription;
      let analysisSourceUrl = sourceUrl;
      let analysisSourceName = offerPreview?.sourceName || "";
      let isUrlSource = offerPreview?.extractionStatus === "success" && offerPreview.sourceType === "url";
      if (isPublicHttpUrl(jobDescription.trim())) {
        const extractedOffer = await requestOfferExtraction(jobDescription.trim());
        if (extractedOffer.extractionStatus !== "success" || !extractedOffer.offerText.trim()) { setError(URL_EXTRACTION_FALLBACK); return; }
        offerText = extractedOffer.offerText;
        analysisSourceUrl = extractedOffer.sourceUrl;
        analysisSourceName = extractedOffer.sourceName;
        isUrlSource = true;
        setSourceUrl(extractedOffer.sourceUrl);
        setOfferPreview(extractedOffer);
      }
      const formData = new FormData(); formData.append("jobDescription", offerText); formData.append("cv", cvFile); formData.append("sourceType", isUrlSource ? "url" : "manual"); if (isUrlSource && analysisSourceUrl) formData.append("sourceUrl", analysisSourceUrl); if (isUrlSource && analysisSourceName) formData.append("sourceName", analysisSourceName);
      const response = await fetch("/api/analyze", { method: "POST", body: formData });
      const data = await readJsonResponse(response);
      if (!response.ok) throw new Error(typeof data.error === "string" ? data.error : "No pudimos analizar tu CV.");
      setAnalysis(data as unknown as Analysis);
    } catch (requestError) { setError(requestError instanceof Error ? requestError.message : "Ocurrió un error inesperado."); } finally { setIsLoading(false); }
  }

  async function handleExtractOffer() {
    setError(""); setOfferPreview(null);
    if (!sourceUrl.trim()) { setError("Pegá la URL del aviso laboral para leerlo automáticamente."); return; }
    setIsExtracting(true);
    try {
      const data = await requestOfferExtraction(sourceUrl.trim());
      setOfferPreview(data);
      if (data.extractionStatus !== "success") setError(URL_EXTRACTION_FALLBACK);
    } catch { setError(URL_EXTRACTION_FALLBACK); } finally { setIsExtracting(false); }
  }

  async function requestOfferExtraction(url: string): Promise<JobOfferPreview> {
    const response = await fetch("/api/extract-offer", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ url }) });
    const data = await readJsonResponse(response);
    if (!response.ok) throw new Error(URL_EXTRACTION_FALLBACK);
    return data as unknown as JobOfferPreview;
  }

  function confirmOffer() {
    if (!offerPreview || offerPreview.extractionStatus !== "success") return;
    const sections = [offerPreview.title && `Título: ${offerPreview.title}`, offerPreview.company && `Empresa: ${offerPreview.company}`, offerPreview.location && `Ubicación: ${offerPreview.location}`, offerPreview.modality && `Modalidad: ${offerPreview.modality}`, offerPreview.description, offerPreview.responsibilities && `Responsabilidades: ${offerPreview.responsibilities}`, offerPreview.requirements && `Requisitos: ${offerPreview.requirements}`, offerPreview.education && `Formación: ${offerPreview.education}`, offerPreview.experience && `Experiencia: ${offerPreview.experience}`, offerPreview.skills && `Conocimientos y herramientas: ${offerPreview.skills}`, offerPreview.benefits && `Beneficios: ${offerPreview.benefits}`].filter(Boolean);
    setJobDescription(sections.join("\n\n")); setError("");
  }

  async function readJsonResponse(response: Response): Promise<Record<string, unknown>> {
    const body = await response.text();
    if (!body.trim()) {
      throw new Error(response.ok ? "El servidor no devolvió una respuesta válida." : "El servidor no devolvió un mensaje de error.");
    }
    try {
      const data: unknown = JSON.parse(body);
      if (!data || typeof data !== "object" || Array.isArray(data)) throw new Error("Respuesta inválida");
      return data as Record<string, unknown>;
    } catch {
      throw new Error(response.ok ? "El servidor devolvió una respuesta inválida." : `El servidor respondió con un error (${response.status}).`);
    }
  }

  function reset() { setAnalysis(null); setError(""); setCvFile(null); setJobDescription(""); setSourceUrl(""); setOfferPreview(null); }

  return <main>
    <header className="topbar"><div className="shell topbar-inner"><a className="brand" href="#inicio" aria-label="CR Gestión con Resultados, inicio"><img src="/branding/logo-consultora.png" alt="CR Gestión con Resultados" /><span><strong>CR Gestión con Resultados</strong><small>Tu Match Profesional</small></span></a><button className="menu-toggle" type="button" aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"} aria-expanded={isMenuOpen} onClick={() => setIsMenuOpen(!isMenuOpen)}><span /><span /><span /></button><nav className={isMenuOpen ? "main-nav is-open" : "main-nav"} aria-label="Navegación principal"><a href="#inicio" onClick={() => setIsMenuOpen(false)}>Inicio</a><a href="#como-funciona" onClick={() => setIsMenuOpen(false)}>Cómo funciona</a><a href="#tipos-de-cv" onClick={() => setIsMenuOpen(false)}>Tipos de CV</a><a href="#consultora" onClick={() => setIsMenuOpen(false)}>Sobre la consultora</a><a href="#contacto" onClick={() => setIsMenuOpen(false)}>Contacto</a><a className="whatsapp-header-button" href={WHATSAPP_URL} target="_blank" rel="noreferrer">Hablar por WhatsApp</a><a className="linkedin-button nav-linkedin" href={LINKEDIN_COMPANY_URL} target="_blank" rel="noreferrer">Conectá en LinkedIn <span>→</span></a></nav></div></header>
    <section className="hero shell" id="inicio"><div className="hero-copy"><div className="eyebrow">TU MATCH PROFESIONAL</div><h1>¿Esta oportunidad realmente encaja con tu perfil? <em>Analizala antes de postularte.</em></h1><p>Compará los requisitos reales de la búsqueda con tu experiencia y recibí un diagnóstico claro, objetivo y con recomendaciones para potenciar tu postulación.</p><div className="hero-benefits"><span>✓ Análisis real de requisitos</span><span>✓ Basado en tu experiencia real</span><span>✓ Recomendaciones concretas y accionables</span></div></div><div className="hero-visual" aria-hidden="true"><div className="visual-orbit" /><div className="profile-card"><div className="profile-avatar">GR</div><div><strong>Perfil profesional</strong><span>Experiencia + oportunidad</span></div><b>✓</b></div><div className="visual-stat"><span>Match profesional</span><strong>CV + aviso</strong></div></div></section>
    <section className="landing-info shell" aria-label="Información de Tu Match Profesional"><div className="landing-section landing-how" id="como-funciona"><div className="landing-heading"><div className="eyebrow">CÓMO FUNCIONA</div><h2>Un proceso claro para decidir mejor.</h2><p>En pocos pasos, convertí una oportunidad laboral y tu experiencia en una lectura concreta para tu próxima postulación.</p></div><div className="landing-steps"><article><span>01</span><h3>Leé la oportunidad</h3><p>Compartí el aviso laboral completo o pegá el enlace de la búsqueda.</p></article><article><span>02</span><h3>Cargá tu CV</h3><p>Usamos tu experiencia real para comparar requisitos y antecedentes.</p></article><article><span>03</span><h3>Recibí tu diagnóstico</h3><p>Conocé tus coincidencias, brechas y próximos pasos accionables.</p></article></div></div><div className="landing-grid"><div className="landing-section" id="tipos-de-cv"><div className="eyebrow">TIPOS DE CV</div><h2>Trabajá con el formato que ya tenés.</h2><p>Podés cargar tu CV en PDF, DOCX o TXT. El análisis se enfoca en el contenido de tu experiencia, no en una plantilla determinada.</p><div className="format-list"><span>PDF</span><span>DOCX</span><span>TXT</span></div></div><div className="landing-section landing-about" id="consultora"><div className="eyebrow">SOBRE LA CONSULTORA</div><h2>Personas, procesos y resultados en equilibrio.</h2><p>CR Gestión con Resultados acompaña decisiones laborales y organizacionales con una mirada práctica, humana y orientada a la mejora.</p><strong>Más de 20 años de experiencia</strong><span>Gestión de Personas · Relaciones Laborales · Empleabilidad</span></div></div><div className="landing-section landing-contact" id="contacto"><div><div className="eyebrow">CONTACTO</div><h2>¿Querés conversar sobre tu próximo paso?</h2><p>Podés contactarme directamente para consultar por asesoramiento de empleabilidad y desarrollo profesional.</p></div><a className="whatsapp-button" href={WHATSAPP_URL} target="_blank" rel="noreferrer">Hablar por WhatsApp <span>↗</span></a></div></section>
    <div className="progress-shell shell" aria-label="Progreso del análisis"><div className="progress-step active"><b>01</b><span>Oportunidad</span></div><div className="progress-connector" /><div className="progress-step"><b>02</b><span>CV</span></div><div className="progress-connector" /><div className="progress-step"><b>03</b><span>Análisis</span></div><div className="progress-connector" /><div className="progress-step"><b>04</b><span>Resultado</span></div></div>
    <section className="workspace shell"><form className="analysis-card" onSubmit={handleSubmit}><div className="analysis-card-header"><div><div className="eyebrow">EMPECEMOS POR TU OPORTUNIDAD</div><h2>Primero, contanos qué oportunidad querés analizar</h2></div><span className="analysis-card-note">Tu información se procesa de forma privada</span></div><div className="input-grid">
      <div className="panel job-panel"><div className="panel-heading"><div><span className="step">01</span><div><h2>El aviso laboral</h2><small>La oportunidad que querés analizar</small></div></div><span className="required">Obligatorio</span></div><div className="offer-url-entry"><label htmlFor="offer-url">También podés pegar el link del aviso</label><div className="url-row"><input id="offer-url" data-source-type={offerPreview?.extractionStatus === "success" ? "url" : "manual"} type="url" value={sourceUrl} onChange={(event) => { setSourceUrl(event.target.value); setOfferPreview(null); }} placeholder="https://..." /><button type="button" onClick={handleExtractOffer} disabled={isExtracting}>{isExtracting ? "Leyendo..." : "Leer aviso"}</button></div><small>Solo se intenta leer contenido público. Si el portal bloquea el acceso, pegá el texto debajo.</small></div>{offerPreview?.extractionStatus === "success" && <div className="offer-preview"><div className="offer-preview-heading"><div><span className="eyebrow">OFERTA DETECTADA</span><h3>{offerPreview.title || "Aviso laboral"}</h3></div><span className="offer-status">✓ Aviso cargado correctamente</span></div><p>{offerPreview.company && <>Empresa: {offerPreview.company}<br /></>}{offerPreview.location && <>Ubicación: {offerPreview.location}<br /></>}{offerPreview.modality && <>Modalidad: {offerPreview.modality}<br /></>}Fuente: {offerPreview.sourceName}</p><a href={offerPreview.sourceUrl} target="_blank" rel="noreferrer">Ver aviso original ↗</a><button type="button" className="confirm-offer" onClick={confirmOffer}>Continuar con el análisis</button></div>}{offerPreview?.extractionStatus !== "success" && <label htmlFor="job-description">Pegá la descripción completa de la búsqueda</label>}<textarea id="job-description" value={jobDescription} onChange={(event) => setJobDescription(event.target.value)} placeholder="Pegá aquí la descripción completa de la oferta laboral..." /><div className="field-footer"><span>{jobDescription.length} caracteres</span><span>Cuanto más completa, mejor el análisis</span></div></div>
      <div className="panel cv-panel"><div className="panel-heading"><div><span className="step">02</span><div><h2>Tu CV</h2><small>La experiencia que ya tenés</small></div></div><span className="required">Obligatorio</span></div><label className="upload-zone" htmlFor="cv-upload"><span className="upload-icon">↑</span><strong>{cvFile ? cvFile.name : "Subí tu CV"}</strong><span>{cvFile ? `${(cvFile.size / 1024).toFixed(0)} KB · listo para analizar` : "PDF, DOCX o TXT · hasta 8 MB"}</span><span className="upload-action">Seleccionar archivo</span><input id="cv-upload" type="file" accept=".pdf,.docx,.txt" onChange={handleFileChange} /></label><div className="privacy-note"><span>●</span> Tu CV se procesa de forma privada y no se guarda.</div></div>
      <div className="form-actions">{error && <div className="error-message" role="alert">{error}</div>}<button className="primary-button" type="submit" disabled={isLoading || !jobDescription.trim() || !cvFile}>{isLoading ? "Analizando tu compatibilidad..." : "Analizar mi postulación"}<span>→</span></button></div>
    </div></form><div className="trust-strip"><span>✓ <b>No inventamos experiencia</b></span><span>✓ <b>Analizamos requisitos reales</b></span><span>✓ <b>Te mostramos qué mejorar</b></span></div>{analysis ? <Results analysis={analysis} onReset={reset} /> : <EmptyResults />}</section>
    <footer className="footer"><div className="shell footer-inner"><div className="footer-brand"><img src="/branding/logo-consultora.png" alt="CR Gestión con Resultados" /><div><strong>CR Gestión con Resultados</strong><span>Consultora en Recursos Humanos y Optimización Operativa</span><span>Personas, procesos y resultados en equilibrio.</span></div></div><div className="footer-contact">{LINKEDIN_COMPANY_URL && <a className="linkedin-button" href={LINKEDIN_COMPANY_URL} target="_blank" rel="noreferrer">LinkedIn de la consultora <span>→</span></a>}<a href={LINKEDIN_PERSONAL_URL} target="_blank" rel="noreferrer">LinkedIn profesional ↗</a><a href="mailto:cr.gestiondepersonas@gmail.com">cr.gestiondepersonas@gmail.com</a></div><div className="footer-bottom"><span>© CR Gestión con Resultados</span><span><a href="#contacto">Términos de uso</a> <i>|</i> <a href="#contacto">Política de privacidad</a></span></div></div></footer>
  </main>;
}

function Results({ analysis, onReset }: { analysis: Analysis; onReset: () => void }) {
  return <section className="results" aria-live="polite"><div className="results-header"><div><div className="eyebrow">03 · TU DIAGNÓSTICO</div><h2>Una lectura concreta para tu próxima postulación.</h2></div><button className="text-button" onClick={onReset}>Nuevo análisis <span>↗</span></button></div><div className="score-layout"><div className="score-card"><div className="score-label">Tu nivel de coincidencia</div><div className="score-number">{analysis.score}<small>%</small></div><div className="score-line"><span style={{ width: `${analysis.score}%` }} /></div><p>{analysis.summary}</p></div><div className="quick-stats"><div><strong>{analysis.strengths.length}</strong><span>Coincidencias encontradas</span></div><div><strong>{analysis.gaps.length}</strong><span>Brechas detectadas</span></div><div><strong>{analysis.recommendations.length}</strong><span>Qué mejorar antes de postularte</span></div></div></div><div className="insights-grid"><Insight title="Fortalezas" items={analysis.strengths} tone="positive" empty="No encontramos fortalezas suficientes con la información disponible." /><Insight title="Brechas" items={analysis.gaps} tone="warning" empty="No detectamos brechas críticas en las categorías evaluadas." /><Insight title="Palabras clave a revisar" items={analysis.missingKeywords} tone="neutral" empty="No hay evidencia suficiente en el CV para determinar este requisito." /><Insight title="Experiencia relevante encontrada" items={analysis.relevantExperience} tone="evidence" empty="No encontramos fragmentos de experiencia directamente relacionados." /></div><div className="recommendation-row"><div><div className="eyebrow">SIGUIENTE PASO</div><h3>Recomendaciones concretas</h3>{analysis.recommendations.map((item) => <p key={item}><span>✓</span>{item}</p>)}</div><div className="highlight-box"><h3>Qué destacar antes de postularte</h3>{analysis.highlight.map((item) => <p key={item}>{item}</p>)}</div></div><p className="evidence-note">Este diagnóstico solo utiliza información que aparece en tu CV. No agrega experiencia, títulos, empresas ni conocimientos nuevos.</p></section>;
}

function EmptyResults() {
  return <section className="empty-results" aria-label="Estado del análisis"><div className="empty-results-mark">01</div><div><div className="eyebrow">RESULTADO DE TU ANÁLISIS</div><h2>Tu análisis aparecerá aquí</h2><p>Completá la oferta y cargá tu CV para comenzar.</p></div><div className="empty-results-line" /></section>;
}

function Insight({ title, items, tone, empty }: { title: string; items: string[]; tone: string; empty: string }) {
  const simpleTitles: Record<string, string> = { Fortalezas: "Requisitos que cumple", Brechas: "Brechas", "Palabras clave a revisar": "Requisitos que no aparecen en el CV", "Experiencia relevante encontrada": "Experiencia relevante" };
  return <><div className={`insight-card ${tone}`}><h3>{simpleTitles[title] || title}</h3>{items.length ? <ul>{items.map((item) => <li key={item}>{item}</li>)}</ul> : <p className="empty-state">{empty}</p>}</div>{title === "Experiencia relevante encontrada" && <ContactCta />}</>;
}

function ContactCta() {
  const sourceInput = typeof document !== "undefined" ? document.getElementById("offer-url") as HTMLInputElement | null : null;
  const sourceType = sourceInput?.dataset.sourceType === "url" ? "url" : "manual";
  const sourceUrl = sourceType === "url" ? sourceInput?.value || "" : "";
  let sourceHost = "";
  try { sourceHost = sourceUrl ? new URL(sourceUrl).hostname.replace(/^www\./, "") : ""; } catch { sourceHost = ""; }
  const sourceNames: Record<string, string> = { "linkedin.com": "LinkedIn", "computrabajo.com": "Computrabajo", "indeed.com": "Indeed", "bumeran.com.ar": "Bumeran", "zonajobs.com.ar": "ZonaJobs" };
  const sourceName = sourceNames[sourceHost] || sourceHost;
  return <section className="contact-cta" aria-label="Asesoramiento profesional"><div className="result-source-box"><strong>Origen del aviso: {sourceType === "url" ? sourceName : "texto pegado"}</strong>{sourceUrl && <a href={sourceUrl} target="_blank" rel="noreferrer">Ver aviso original ↗</a>}</div><div><div className="eyebrow">¿QUERÉS SEGUIR AVANZANDO?</div><h3>¿Querés mejorar tus posibilidades de postulación?</h3><p>Este análisis es un diagnóstico inicial. Si querés una revisión profesional de tu CV, perfil y estrategia de búsqueda laboral, puedo ayudarte.</p></div><div className="contact-cta-actions"><a className="whatsapp-button" href={WHATSAPP_URL} target="_blank" rel="noreferrer">Consultas por WhatsApp <span>↗</span></a><a className="linkedin-link" href={LINKEDIN_PERSONAL_URL} target="_blank" rel="noreferrer">Ver perfil profesional ↗</a></div><div className="contact-details"><strong>Gestión con Resultados</strong><span>Mg. Carla Rodríguez</span><a href={`tel:+${WHATSAPP_NUMBER}`}>+54 9 11 2489-5402</a><a href="mailto:cr.gestiondepersonas@gmail.com">cr.gestiondepersonas@gmail.com</a></div></section>;
}