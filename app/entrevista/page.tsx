import type { Metadata } from "next";
import EntrevistaTool from "./EntrevistaTool";

export const metadata: Metadata = {
  title: "Generador de entrevistas por competencias | CR Gestión con Resultados",
  description: "Herramienta gratuita de Tu Match Profesional: generá una guía de entrevista estructurada con preguntas conductuales, método STAR y puntuación de 1 a 5.",
};

export default function EntrevistaPage() {
  return <EntrevistaTool />;
}
