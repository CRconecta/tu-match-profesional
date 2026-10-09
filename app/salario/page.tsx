import type { Metadata } from "next";
import SalaryTool from "./SalaryTool";

export const metadata: Metadata = {
  title: "Calculadora de objetivo salarial | Tu Match Profesional",
  description: "Compará remuneración actual, objetivo, piso personal y oferta con cálculos transparentes, sin benchmarks de mercado.",
};

export default function SalaryPage() {
  return <SalaryTool />;
}
