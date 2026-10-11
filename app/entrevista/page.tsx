import type { Metadata } from "next";
import EntrevistaTool from "./EntrevistaTool";

export const metadata: Metadata = {
  title: "Entrevistas por competencias para RR. HH. | CR Gestión con Resultados",
  description: "Herramienta para selectores y responsables de RR. HH.: generá guías de entrevista estructuradas con preguntas conductuales, método STAR y puntuación de 1 a 5.",
};

export default function EntrevistaPage() {
  return <EntrevistaTool />;
}
