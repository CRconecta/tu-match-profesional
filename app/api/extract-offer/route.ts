import { NextResponse } from "next/server";
import { extractJobOffer, validatePublicUrl } from "../../../lib/jobOfferExtractor";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (typeof body.url !== "string" || !body.url.trim()) return NextResponse.json({ error: "Pegá la URL del aviso laboral." }, { status: 400 });
    validatePublicUrl(body.url.trim());
    return NextResponse.json(await extractJobOffer(body.url.trim()));
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "La URL no es válida." }, { status: 400 });
  }
}