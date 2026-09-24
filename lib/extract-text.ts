import mammoth from "mammoth";
import pdfParse from "pdf-parse";
const DOCX_TYPE = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
export async function extractText(file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer()); const extension = file.name.toLowerCase().slice(file.name.lastIndexOf("."));
  if (file.type === "application/pdf" || extension === ".pdf") return (await pdfParse(buffer)).text;
  if (file.type === DOCX_TYPE || extension === ".docx") return (await mammoth.extractRawText({ buffer })).value;
  if (file.type === "text/plain" || extension === ".txt") return buffer.toString("utf-8");
  throw new Error("Formato no soportado. Subí un PDF, DOCX o TXT.");
}