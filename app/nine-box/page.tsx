import type { Metadata } from "next";
import NineBoxTool from "./NineBoxTool";

export const metadata: Metadata = {
  title: "Autoevaluación Nine Box (versión de trabajo) | Tu Match Profesional",
  description: "Versión de trabajo de una autoevaluación para estimar el cuadrante actual de desempeño y potencial.",
  // Versión de trabajo: no se indexa hasta que el contenido sea validado.
  robots: { index: false, follow: false },
};

export default function NineBoxPage() {
  return <NineBoxTool />;
}
