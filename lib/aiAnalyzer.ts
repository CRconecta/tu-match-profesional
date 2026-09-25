export type AnalysisResult = {
  score: number;
  summary: string;
  strengths: string[];
  gaps: string[];
  missingKeywords: string[];
  relevantExperience: string[];
  recommendations: string[];
  highlight: string[];
  cvFileName: string;
};

const NO_EVIDENCE = "No hay evidencia suficiente en el CV para determinar este requisito.";

function stringList(value: unknown) {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string" && item.trim().length > 0).slice(0, 12) : [];
}

function parseModelResponse(content: string, cvFileName: string): AnalysisResult | null {
  try {
    const json = content.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();
    const data = JSON.parse(json) as Record<string, unknown>;
    const score = Number(data.score);
    if (!Number.isFinite(score)) return null;
    return {
      score: Math.min(100, Math.max(0, Math.round(score))),
      summary: typeof data.summary === "string" ? data.summary : "El modelo no pudo resumir la coincidencia con la evidencia disponible.",
      strengths: stringList(data.strengths),
      gaps: stringList(data.gaps),
      missingKeywords: stringList(data.missingKeywords).map((item) => item.includes(NO_EVIDENCE) ? item : `${item}: ${NO_EVIDENCE}`),
      relevantExperience: stringList(data.relevantExperience),
      recommendations: stringList(data.recommendations),
      highlight: stringList(data.highlight),
      cvFileName,
    };
  } catch {
    return null;
  }
}

export async function analyzeWithAI(jobDescription: string, cvText: string, cvFileName: string): Promise<AnalysisResult | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  const endpoint = `${process.env.OPENAI_BASE_URL || "https://api.openai.com/v1"}/chat/completions`;
  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    signal: AbortSignal.timeout(30000),
    body: JSON.stringify({
      model,
      temperature: 0,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `Sos un analista de selección laboral. Compará semánticamente un aviso laboral con un CV y respondé únicamente JSON válido. Usá exclusivamente información explícita del CV para afirmar coincidencias, experiencia, formación o competencias. No inventes, completes ni infieras experiencia, títulos, empresas, años o habilidades. Una equivalencia semántica solo es válida si el CV expresa ese concepto. Si un requisito no puede determinarse con evidencia suficiente, incluilo en missingKeywords con el texto exacto: "${NO_EVIDENCE}". Clasificá en strengths los requisitos cumplidos, en gaps los parcialmente cumplidos y en missingKeywords los que no tienen evidencia suficiente. Las recomendaciones deben indicar cómo mejorar la presentación usando únicamente información ya existente en el CV. relevantExperience debe contener únicamente fragmentos textuales breves del CV, sin paráfrasis ni datos nuevos. El score debe ser un entero de 0 a 100 calculado sobre requisitos únicos del aviso, sin contar dos veces variantes con acentos, mayúsculas o singular/plural. Usá este esquema: {"score": number, "summary": string, "strengths": string[], "gaps": string[], "missingKeywords": string[], "relevantExperience": string[], "recommendations": string[], "highlight": string[]}.`,
        },
        {
          role: "user",
          content: `AVISO LABORAL:\n${jobDescription}\n\nCV:\n${cvText}`,
        },
      ],
    }),
  });

  if (!response.ok) {
    console.warn("AI analysis provider failed", response.status, await response.text());
    return null;
  }

  const body = await response.json() as { choices?: Array<{ message?: { content?: string } }> };
  const content = body.choices?.[0]?.message?.content;
  return typeof content === "string" ? parseModelResponse(content, cvFileName) : null;
}