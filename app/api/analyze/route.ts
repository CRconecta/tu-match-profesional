import { NextResponse } from "next/server";
import { analyzeWithAI } from "../../../lib/aiAnalyzer";
import { analyze } from "../../../lib/analyzer";
import { extractText } from "../../../lib/extract-text";
export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const jobDescription = formData.get("jobDescription");
    const cv = formData.get("cv");
    const requestedSourceType = formData.get("sourceType");
    const sourceUrlValue = formData.get("sourceUrl");
    const sourceNameValue = formData.get("sourceName");

    if (typeof jobDescription !== "string" || !jobDescription.trim()) return NextResponse.json({ error: "Falta el texto del aviso laboral." }, { status: 400 });
    if (!(cv instanceof File)) return NextResponse.json({ error: "Falta el archivo del CV." }, { status: 400 });
    if (cv.size > 8 * 1024 * 1024) return NextResponse.json({ error: "El CV supera el límite de 8 MB." }, { status: 400 });

    const cvText = (await extractText(cv)).replace(/\s+/g, " ").trim();
    if (!cvText) return NextResponse.json({ error: "No pudimos encontrar texto en el CV. Probá con otro archivo." }, { status: 422 });

    const sourceType = requestedSourceType === "url" || (requestedSourceType !== "manual" && typeof sourceUrlValue === "string" && Boolean(sourceUrlValue.trim())) ? "url" : "manual";
    const sourceUrl = sourceType === "url" && typeof sourceUrlValue === "string" && sourceUrlValue.trim() ? sourceUrlValue.trim() : null;
    const sourceName = sourceType === "url" && typeof sourceNameValue === "string" && sourceNameValue.trim() ? sourceNameValue.trim() : null;

    const analysis = await analyzeWithAI(jobDescription, cvText, cv.name).catch((error) => {
      console.warn("AI analysis unavailable, using deterministic analysis", error instanceof Error ? error.message : error);
      return null;
    });
    return NextResponse.json({ ...(analysis ?? analyze(jobDescription, cvText, cv.name)), sourceType, sourceUrl, sourceName, offerText: jobDescription });
  } catch (error) {
    console.error("CV analysis failed", error);
    return NextResponse.json({ error: error instanceof Error && error.message ? error.message : "No pudimos leer el archivo. Verificá que sea un PDF, DOCX o TXT válido." }, { status: 422 });
  }
}