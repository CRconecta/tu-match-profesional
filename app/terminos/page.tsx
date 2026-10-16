import type { Metadata } from "next";
import { CommercialFooter, CommercialHeader } from "../components/CommercialTools";
import styles from "../commercialTools.module.css";

export const metadata: Metadata = {
  title: "Términos de uso y propiedad intelectual | Tu Match Profesional",
  description: "Condiciones de uso de Tu Match Profesional y protección de su propiedad intelectual.",
};

export default function Terminos() {
  return (
    <>
      <CommercialHeader />
      <main className="shell" style={{ maxWidth: 780, padding: "32px 20px 56px", lineHeight: 1.65 }}>
        <h1>Términos de uso y propiedad intelectual</h1>
        <p><small>Última actualización: octubre de 2026</small></p>
        <h2>1. Titularidad</h2>
        <p>Tu Match Profesional es una iniciativa de CR Gestión de Personas &amp; Operaciones. Su diseño, código, textos, metodologías, estructuras de preguntas, matrices y logotipos están protegidos por la legislación de propiedad intelectual de la República Argentina (Ley 11.723) y por los tratados internacionales aplicables. Todos los derechos reservados.</p>
        <h2>2. Uso permitido</h2>
        <p>Podés usar las herramientas gratuitas para tu búsqueda laboral o tu trabajo profesional, e imprimir o guardar los resultados que generes, citando la fuente.</p>
        <h2>3. Uso no permitido</h2>
        <p>Sin autorización escrita previa, no está permitido copiar, reproducir, extraer, descompilar, adaptar, redistribuir, revender ni ofrecer como propias las herramientas, sus metodologías, su código, sus textos o sus diseños, ni integrarlas en productos o servicios de terceros, ni usar procedimientos automáticos para extraer su contenido o sus datos.</p>
        <h2>4. Carácter orientativo</h2>
        <p>Los resultados son orientativos y no reemplazan el análisis profesional de cada caso. Las referencias salariales provienen de terceros, indican su fuente y fecha, y no constituyen una oferta, un piso ni una garantía. Tu Match Profesional no asegura resultados en procesos de selección.</p>
        <h2>5. Estadísticas de uso</h2>
        <p>Medimos visitas y clics de forma agregada y anónima, sin cookies y sin datos personales, respetando las señales de &quot;No rastrear&quot; del navegador.</p>
        <h2>6. Contacto</h2>
        <p>Para solicitar autorización de uso o versiones a medida: <a href="mailto:cr.gestiondepersonas@gmail.com">cr.gestiondepersonas@gmail.com</a>.</p>
        <p><a href="/">← Volver a Tu Match Profesional</a></p>
      </main>
      <CommercialFooter />
    </>
  );
}
