import type { Metadata } from "next";
import Analytics from "./Analytics";
import "./globals.css";

const umamiWebsiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;

export const metadata: Metadata = {
  title: "CR Gestión con Resultados | Tu Match Profesional",
  description: "Compará tu CV con una oportunidad laboral y recibí un diagnóstico claro antes de postularte.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es"><body>{umamiWebsiteId && <Analytics websiteId={umamiWebsiteId} />}{children}</body></html>;
}