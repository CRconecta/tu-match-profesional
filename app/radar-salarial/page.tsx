import type { Metadata } from "next";
import RadarSalarial from "./RadarSalarial";

export const metadata: Metadata = {
  title: "Radar salarial | Tu Match Profesional",
  description: "Referencias de remuneración de mercado por puesto, siempre con fuente, fecha, zona y nivel de confianza. Sin cifras inventadas.",
};

export default function RadarSalarialPage() {
  return <RadarSalarial />;
}
