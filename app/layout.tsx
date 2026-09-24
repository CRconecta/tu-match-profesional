import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CR Gestión con Resultados | Tu Match Profesional",
  description: "Compará tu CV con una oportunidad laboral y recibí un diagnóstico claro antes de postularte.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es"><body>{children}</body></html>;
}