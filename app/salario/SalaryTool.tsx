import { CommercialCta, CommercialFooter, CommercialHeader } from "../components/CommercialTools";
import styles from "../commercialTools.module.css";

const sources = {
  michaelPage: {
    name: "Guía Salarial 2026 · Argentina",
    publisher: "Michael Page",
    url: "https://www.michaelpage.com.ar/guia-salarial",
  },
  randstadGuide: {
    name: "Reporte Salarial · julio 2026",
    publisher: "Randstad Argentina",
    url: "https://www.randstad.com.ar/estudios-y-tendencias/reporte-salarial/",
  },
  randstadProjection: {
    name: "Salarios 2026: proyección de aumentos para el primer semestre",
    publisher: "Randstad Argentina",
    date: "12 de marzo de 2026 (encabezado; metadatos del sitio: 13 de marzo)",
    url: "https://www.randstad.com.ar/quienes-somos/press-releases/salarios-2026-empresas-proyectan-aumentos-del-175-primer-semestre/",
  },
};

export default function SalaryTool() {
  return (
    <>
      <CommercialHeader current="/salario" />
      <main className={styles.page}>
        <section className={`shell ${styles.hero}`}>
          <div className="eyebrow">TU MATCH PROFESIONAL · REFERENCIAS PUBLICADAS</div>
          <h1>Consultá referencias salariales verificables.</h1>
          <p>
            Reunimos fuentes salariales publicadas para Argentina y mostramos sus límites. No
            estimamos remuneraciones ni completamos rangos que no puedan verificarse en el informe.
          </p>
        </section>

        <div className={`shell ${styles.content}`}>
          <section className={styles.card} aria-labelledby="market-salaries-title">
            <h2 id="market-salaries-title">Salarios de mercado</h2>
            <p className={styles.resultIntro}>
              Las referencias por puesto requieren una banda salarial publicada que permita verificar
              cargo, período, moneda y si el valor es bruto o neto. Las páginas públicas consultadas
              describen informes 2026, pero no exponen esas tablas.
            </p>
            <div className={styles.guideGrid}>
              <article className={styles.guideCard}>
                <span className={styles.tag}>Argentina · 2026</span>
                <h3>{sources.michaelPage.name}</h3>
                <p>
                  La página de acceso invita a descargar la guía, pero no publica allí rangos por
                  puesto. Por eso no mostramos cifras ni inferimos moneda, periodicidad o criterio
                  bruto/neto.
                </p>
                <a href={sources.michaelPage.url} target="_blank" rel="noopener noreferrer">
                  Consultar la guía de {sources.michaelPage.publisher} ↗
                </a>
              </article>
              <article className={styles.guideCard}>
                <span className={styles.tag}>Argentina · julio 2026</span>
                <h3>{sources.randstadGuide.name}</h3>
                <p>
                  Randstad indica que el reporte completo contiene bandas por industria y región,
                  actualizadas a julio de 2026. La descarga requiere completar un formulario; la
                  página pública no muestra los importes ni permite verificar los campos de cada banda.
                </p>
                <a href={sources.randstadGuide.url} target="_blank" rel="noopener noreferrer">
                  Consultar el reporte de {sources.randstadGuide.publisher} ↗
                </a>
              </article>
            </div>
            <p className={styles.hint}>
              <strong>Rangos por puesto disponibles en esta herramienta: ninguno.</strong> No
              publicamos valores de esas guías sin acceso verificable a las tablas completas y a sus
              definiciones.
            </p>
          </section>

          <section className={styles.card} aria-labelledby="expectations-title">
            <h2 id="expectations-title">Expectativas salariales: distinguir qué se está midiendo</h2>
            <div className={styles.guideGrid}>
              <article className={styles.guideCard}>
                <span className={styles.tag}>Proyección empresarial · no es pretensión individual</span>
                <h3>Aumentos previstos para personal fuera de convenio</h3>
                <p>
                  Randstad informó una proyección de aumentos salariales para el primer semestre de
                  2026. Es un indicador agregado de empresas; no representa una pretensión de
                  candidatos ni una banda salarial para un puesto.
                </p>
                <div className={styles.metricGrid}>
                  <div className={styles.metric}>
                    <span>Puestos</span>
                    <strong>No desglosados</strong>
                  </div>
                  <div className={styles.metric}>
                    <span>Variación proyectada</span>
                    <strong>4%–35%</strong>
                    <span>Promedio informado: 17,5%</span>
                  </div>
                  <div className={styles.metric}>
                    <span>Moneda y bruto/neto</span>
                    <strong>No aplica</strong>
                    <span>Es un porcentaje de ajuste, no un importe salarial.</span>
                  </div>
                  <div className={styles.metric}>
                    <span>Período de los ajustes</span>
                    <strong>Primer semestre de 2026</strong>
                  </div>
                </div>
                <p>
                  <strong>Fuente:</strong> {sources.randstadProjection.publisher}. Datos relevados
                  entre noviembre y diciembre de 2025 a 256 empresas de todo el país. Publicado el{" "}
                  {sources.randstadProjection.date}.
                </p>
                <a href={sources.randstadProjection.url} target="_blank" rel="noopener noreferrer">
                  Leer el informe de {sources.randstadProjection.publisher} ↗
                </a>
              </article>
              <article className={styles.guideCard}>
                <span className={styles.tag}>Pretensiones de candidatos</span>
                <h3>Sin rangos verificables por puesto</h3>
                <p>
                  Las fuentes citadas no publican en sus páginas abiertas una pretensión salarial
                  individual por cargo con importe, moneda, período y criterio bruto/neto. No debe
                  confundirse la proyección empresarial anterior con lo que piden los candidatos.
                </p>
              </article>
            </div>
          </section>

          <section className={styles.card} aria-labelledby="agreements-title">
            <h2 id="agreements-title">Escalas de convenio</h2>
            <p className={styles.resultIntro}>
              No hay escalas de convenio cargadas en esta herramienta. Para informar un importe
              verificable hay que identificar el convenio aplicable y su última escala publicada:
              dependen de la actividad, categoría, jurisdicción y fecha de vigencia. No se presentan
              porcentajes de ajustes fuera de convenio como si fueran escalas convencionales.
            </p>
          </section>

          <CommercialCta />
        </div>
      </main>
      <CommercialFooter />
    </>
  );
}
