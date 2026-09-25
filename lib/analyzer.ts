type Category = "Habilidades" | "Herramientas" | "Puestos" | "Idiomas" | "Formación";
type Detected = { label: string; category: Category };
const catalog: Record<Category, string[]> = {
  Habilidades: ["liderazgo", "comunicación", "comunicacion", "negociación", "negociacion", "ventas", "análisis", "analisis", "planificación", "planificacion", "estrategia", "atención al cliente", "atencion al cliente", "trabajo en equipo", "gestión de proyectos", "gestion de proyectos", "resolución de problemas", "resolucion de problemas"],
  Herramientas: ["excel", "power bi", "sql", "python", "javascript", "typescript", "react", "sap", "salesforce", "crm", "jira", "trello", "tableau", "figma", "google analytics", "adobe", "office"],
  Puestos: ["analista", "desarrollador", "developer", "diseñador", "disenador", "vendedor", "ejecutivo", "asistente", "coordinador", "gerente", "manager", "recruiter", "administrativo", "contador", "marketing", "customer success", "product manager"],
  Idiomas: ["inglés", "ingles", "portugués", "portugues", "francés", "frances", "bilingüe", "bilingue"],
  Formación: ["universitario", "universidad", "terciario", "técnico", "tecnico", "licenciatura", "ingeniería", "ingenieria", "marketing", "administración", "administracion", "contabilidad", "sistemas", "informática", "informatica"],
};
function normalize(text: string) { return text.toLocaleLowerCase("es").normalize("NFD").replace(/[\u0300-\u036f]/g, ""); }
function singularize(word: string) {
  if (word.endsWith("iones")) return `${word.slice(0, -5)}ion`;
  if (word.endsWith("ades")) return `${word.slice(0, -4)}ad`;
  if (word.endsWith("es") && word.length > 4) return word.slice(0, -2);
  if (word.endsWith("s") && word.length > 3) return word.slice(0, -1);
  return word;
}
function tokenize(text: string) { return normalize(text).match(/[a-z0-9]+/g)?.map(singularize) || []; }
function contains(text: string, term: string) {
  const textTokens = tokenize(text);
  const termTokens = tokenize(term);
  return termTokens.length > 0 && textTokens.some((_, index) => termTokens.every((token, offset) => textTokens[index + offset] === token));
}
function canonical(term: string) { return tokenize(term).join(" "); }
function findTerms(text: string): Detected[] {
  const found = new Map<string, Detected>();
  for (const [category, terms] of Object.entries(catalog)) {
    for (const label of terms) {
      const key = canonical(label);
      if (contains(text, label) && !found.has(key)) found.set(key, { label, category: category as Category });
    }
  }
  return [...found.values()];
}
function years(text: string) { return [...text.matchAll(/(\d+)\s*(?:años|anos|year|years)/gi)].map((match) => Number(match[1])).sort((a, b) => b - a)[0] ?? 0; }
function evidence(cv: string, labels: string[]) { return cv.split(/(?<=[.!?\n])\s+/).map((part) => part.trim()).filter((part) => part.length > 25 && labels.some((label) => contains(part, label))).slice(0, 4); }
export function analyze(jobDescription: string, cvText: string, cvFileName: string) {
  const jobTerms = findTerms(jobDescription); const cvTerms = findTerms(cvText); const cvLabels = new Set(cvTerms.map((term) => canonical(term.label))); const matchedTerms = jobTerms.filter((term) => cvLabels.has(canonical(term.label))); const unmatchedTerms = jobTerms.filter((term) => !cvLabels.has(canonical(term.label)));
  const categories: Category[] = ["Habilidades", "Herramientas", "Puestos", "Idiomas", "Formación"]; const categoryResults = categories.map((category) => { const required = jobTerms.filter((term) => term.category === category); const found = required.filter((term) => cvLabels.has(canonical(term.label))); return { category, required, found }; });
  const partialCategories = new Set(categoryResults.filter((result) => result.found.length > 0 && result.found.length < result.required.length).map((result) => result.category)); const strengths = matchedTerms.map((term) => `${term.category}: ${term.label}`); const gaps = categoryResults.filter((result) => partialCategories.has(result.category)).map((result) => `${result.category}: parcialmente cumplidos; falta evidencia de ${result.required.filter((term) => !cvLabels.has(canonical(term.label))).map((term) => term.label).join(", ")}.`);
  const missingKeywords = unmatchedTerms.filter((term) => !partialCategories.has(term.category)).map((term) => `${term.label}: No hay evidencia suficiente en el CV para determinar este requisito.`).slice(0, 10);
  const jobYears = years(jobDescription); const cvYears = years(cvText); const experienceMatched = Boolean(jobYears && cvYears >= jobYears); const requirementCount = jobTerms.length + (jobYears ? 1 : 0); const matchedCount = matchedTerms.length + (experienceMatched ? 1 : 0); const score = requirementCount ? Math.round((matchedCount / requirementCount) * 100) : 0;
  if (jobYears && !experienceMatched) gaps.push(`Experiencia: parcialmente cumplida; el aviso menciona ${jobYears} años y el CV evidencia ${cvYears || "no especifica"}.`);
  const relevantExperience = evidence(cvText, matchedTerms.map((term) => term.label)).map((sentence) => `“${sentence.slice(0, 180)}${sentence.length > 180 ? "..." : ""}”`); const recommendations: string[] = []; if (missingKeywords.length || gaps.length) recommendations.push("Revisá si podés describir con evidencia del CV los requisitos pendientes o parcialmente cumplidos."); if (jobYears && !experienceMatched) recommendations.push("Ordená tu experiencia por relevancia y explicitá solo los años que ya estén respaldados en tu CV."); if (!recommendations.length) recommendations.push("Priorizá en el resumen y en cada experiencia los términos del aviso que ya están presentes en tu CV."); recommendations.push("Usá logros concretos y medibles solo cuando estén respaldados por tu experiencia real.");
  const highlight = strengths.length ? strengths.slice(0, 3).map((item) => `Destacá ${item.toLocaleLowerCase("es")} con ejemplos concretos del CV.`) : ["Reforzá el resumen profesional usando únicamente información que ya figure en tu CV."]; const summary = score >= 75 ? "Tu perfil comparte varios elementos centrales con esta búsqueda." : score >= 50 ? "Hay una base de coincidencia, aunque conviene ajustar el foco antes de postularte." : "La coincidencia es inicial; revisá las brechas antes de enviar tu postulación.";
  return { score, summary, strengths, gaps, missingKeywords, relevantExperience, recommendations, highlight, cvFileName };
}