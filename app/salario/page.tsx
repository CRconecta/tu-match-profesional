import type { Metadata } from "next";
import SalaryTool from "./SalaryTool";

export const metadata: Metadata = {
  title: "Referencias salariales publicadas | Tu Match Profesional",
  description: "Consultá fuentes salariales verificables de Argentina y distinguí salarios de mercado, expectativas y escalas de convenio.",
};

export default function SalaryPage() {
  return <SalaryTool />;
}
