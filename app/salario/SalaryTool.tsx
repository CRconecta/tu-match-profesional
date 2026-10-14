"use client";

import { useEffect, useState } from "react";
import { trackAnalyticsEvent, trackAnalyticsEventOnce } from "../../lib/analytics";
import { CommercialCta, CommercialFooter, CommercialHeader } from "../components/CommercialTools";
import styles from "../commercialTools.module.css";
import OfferComparison from "./OfferComparison";

const officialSources = [
  {
    name: "Ley 24.241, artículo 11",
    description: "Aporte personal al sistema previsional.",
    url: "https://servicios.infoleg.gob.ar/infolegInternet/anexos/0-4999/639/texact.htm#11",
  },
  {
    name: "Ley 23.660, artículo 16",
    description: "Aporte destinado al sistema de obras sociales.",
    url: "https://servicios.infoleg.gob.ar/infolegInternet/anexos/0-4999/62/texact.htm#16",
  },
  {
    name: "ARCA · Retenciones de Ganancias para empleadores",
    description: "Procedimiento de retención acumulado para empleados.",
    url: "https://www.arca.gob.ar/gananciasYBienes/ganancias/retenciones/empleadores/retenciones.asp",
  },
  {
    name: "ARCA · Deducciones personales",
    description: "Ganancia no imponible, cargas de familia y deducción especial por período.",
    url: "https://www.arca.gob.ar/gananciasYBienes/ganancias/personas-humanas-sucesiones-indivisas/deducciones/deducciones-personales.asp",
  },
  {
    name: "ARCA · Escala del artículo 94",
    description: "Escalas de impuesto a la ganancia neta imponible por período.",
    url: "https://www.arca.gob.ar/gananciasYBienes/ganancias/personas-humanas-sucesiones-indivisas/declaracion-jurada/determinativa/determinacion.asp",
  },
  {
    name: "ARCA · SiRADIG",
    description: "Información que el trabajador comunica a su agente de retención.",
    url: "https://www.arca.gob.ar/572Web/siradig/ingreso.asp",
  },
];

const sources = {
  michaelPage: {
    name: "Guía Salarial 2026 · Argentina",
    publisher: "Michael Page",
    publicationDate: "Edición 2026; la página pública no indica la fecha exacta de publicación",
    url: "https://www.michaelpage.com.ar/guia-salarial",
  },
  randstadGuide: {
    name: "Reporte Salarial · julio 2026",
    publisher: "Randstad Argentina",
    publicationDate: "Datos actualizados a julio de 2026, según la página del informe",
    url: "https://www.randstad.com.ar/estudios-y-tendencias/reporte-salarial/",
  },
  randstadProjection: {
    name: "Salarios 2026: proyección de aumentos para el primer semestre",
    publisher: "Randstad Argentina",
    publicationDate: "12 de marzo de 2026",
    url: "https://www.randstad.com.ar/quienes-somos/press-releases/salarios-2026-empresas-proyectan-aumentos-del-175-primer-semestre/",
  },
};

const sourcesVerifiedAt = "10 de octubre de 2026";

export default function SalaryTool() {
  const [grossInput, setGrossInput] = useState("");
  const [payType, setPayType] = useState("habitual");
  useEffect(() => { trackAnalyticsEvent("tool_open_salario"); }, []);
  // Solo se envía el nombre del evento: el importe ingresado nunca llega a la analítica.
  function handleGrossChange(value: string) {
    trackAnalyticsEventOnce("salary_started");
    const parsed = Number(value);
    if (value.trim() !== "" && Number.isFinite(parsed) && parsed >= 0) trackAnalyticsEventOnce("salary_result_generated");
    setGrossInput(value);
  }
  const grossSalary = Number(grossInput);
  const hasValidAmount =
    grossInput !== "" && Number.isFinite(grossSalary) && grossSalary >= 0;
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      maximumFractionDigits: 2,
    }).format(amount);
  const estimate = (rate: number) =>
    Math.round((grossSalary * rate + Number.EPSILON) * 100) / 100;
  const retirement = hasValidAmount ? estimate(0.11) : 0;
  const health = hasValidAmount ? estimate(0.03) : 0;
  const inssjp = hasValidAmount ? estimate(0.03) : 0;
  const totalDeductions = retirement + health + inssjp;
  const netSalary = grossSalary - totalDeductions;

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
          <section className={styles.card} aria-labelledby="salary-calculator-title">
            <h2 id="salary-calculator-title">Calculá cuánto vas a cobrar</h2>
            <p className={styles.resultIntro}>
              Estimá los descuentos legales básicos de un sueldo en relación de dependencia.
              El resultado es orientativo y no reemplaza una liquidación de haberes.
            </p>
            <div className={styles.fieldGrid}>
              <div className={styles.field}>
                <label htmlFor="gross-salary">Sueldo bruto mensual</label>
                <input
                  className={styles.input}
                  id="gross-salary"
                  type="number"
                  inputMode="decimal"
                  min="0"
                  step="0.01"
                  placeholder="Ej.: 1000000"
                  value={grossInput}
                  onChange={(event) => handleGrossChange(event.target.value)}
                  aria-describedby="gross-salary-help"
                  aria-invalid={grossInput !== "" && !hasValidAmount}
                />
                <p id="gross-salary-help">
                  Ingresá el importe en pesos, antes de descuentos. El valor se calcula en este
                  navegador y no se envía ni se guarda en servidores.
                </p>
              </div>
              <div className={styles.field}>
                <label htmlFor="pay-type">Tipo de remuneración</label>
                <select
                  className={styles.input}
                  id="pay-type"
                  value={payType}
                  onChange={(event) => setPayType(event.target.value)}
                >
                  <option value="habitual">Remuneración mensual habitual</option>
                  <option value="variable">Incluye conceptos variables</option>
                </select>
                <p>
                  {payType === "variable"
                    ? "Los conceptos variables pueden tener particularidades según su naturaleza y liquidación. Los porcentajes básicos se aplican al bruto que ingresaste."
                    : "La estimación aplica los porcentajes básicos al bruto mensual que ingresaste."}
                </p>
              </div>
            </div>
            {grossInput !== "" && !hasValidAmount && (
              <p className={styles.error} role="alert">
                Ingresá un importe válido igual o mayor que cero.
              </p>
            )}

            <div className={styles.metricGrid} aria-live="polite">
              <div className={styles.metric}>
                <span>Sueldo bruto ingresado</span>
                <strong>{hasValidAmount ? formatCurrency(grossSalary) : "—"}</strong>
              </div>
              <div className={styles.metric}>
                <span>Aporte jubilatorio estimado · 11%</span>
                <strong>{hasValidAmount ? formatCurrency(retirement) : "—"}</strong>
              </div>
              <div className={styles.metric}>
                <span>Obra social estimada · 3%</span>
                <strong>{hasValidAmount ? formatCurrency(health) : "—"}</strong>
              </div>
              <div className={styles.metric}>
                <span>PAMI / INSSJP estimado · 3%</span>
                <strong>{hasValidAmount ? formatCurrency(inssjp) : "—"}</strong>
              </div>
              <div className={styles.metric}>
                <span>Total de descuentos legales básicos estimados</span>
                <strong>{hasValidAmount ? formatCurrency(totalDeductions) : "—"}</strong>
              </div>
              <div className={styles.metric}>
                <span>Neto estimado antes de otras retenciones</span>
                <strong>{hasValidAmount ? formatCurrency(netSalary) : "—"}</strong>
              </div>
            </div>

            <div className={styles.guideGrid}>
              <article className={styles.guideCard}>
                <h3>¿Qué significa cada descuento?</h3>
                <p>
                  <strong>Jubilación:</strong> aporte personal destinado al sistema previsional
                  que financia las prestaciones jubilatorias.
                </p>
                <p>
                  <strong>Obra social:</strong> aporte personal para el sistema de cobertura de
                  salud correspondiente.
                </p>
                <p>
                  <strong>PAMI / INSSJP:</strong> aporte personal destinado al Instituto Nacional
                  de Servicios Sociales para Jubilados y Pensionados.
                </p>
              </article>
              <article className={styles.guideCard}>
                <h3>¿Qué más puede descontarse?</h3>
                <p>
                  Según la situación individual, también puede haber retenciones de Impuesto a las
                  Ganancias, aportes sindicales o convencionales, cuotas y otras deducciones
                  aplicables. No se calculan aquí porque dependen de datos personales y parámetros
                  vigentes que esta herramienta no solicita ni determina.
                </p>
              </article>
            </div>

            <p className={styles.hint}>
              <strong>Importante:</strong> es un cálculo orientativo de descuentos básicos, no una
              liquidación oficial. El importe efectivamente cobrado puede ser distinto por topes,
              bases imponibles, conceptos remunerativos y no remunerativos, retenciones u otras
              particularidades. No garantiza el neto exacto que vas a cobrar.
            </p>
            <div className={styles.guideCard}>
              <h3>Fuentes oficiales consultadas</h3>
              <ul>
                {officialSources.slice(0, 2).map((source) => (
                  <li key={source.name}>
                    <a href={source.url} target="_blank" rel="noopener noreferrer">
                      {source.name} ↗
                    </a>{" "}
                    — {source.description}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <OfferComparison />

          <section className={styles.card} aria-labelledby="income-tax-title">
            <h2 id="income-tax-title">¿Cuánto me pueden descontar de Ganancias?</h2>
            <p className={styles.hint}>
              No estimamos Ganancias porque el cálculo mensual fiable requiere los acumulados
              salariales, deducciones y retenciones previas que determina el agente de retención.
            </p>
            <details>
              <summary>Fuentes oficiales</summary>
              <ul>
                {officialSources.slice(2).map((source) => (
                  <li key={source.name}>
                    <a href={source.url} target="_blank" rel="noopener noreferrer">
                      {source.name} ↗
                    </a>
                  </li>
                ))}
              </ul>
            </details>
          </section>

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
                <p><strong>Fuente:</strong> {sources.michaelPage.publisher}. <strong>Fecha:</strong> {sources.michaelPage.publicationDate}. <strong>Enlace verificado:</strong> {sourcesVerifiedAt}.</p>
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
                <p><strong>Fuente:</strong> {sources.randstadGuide.publisher}. <strong>Fecha:</strong> {sources.randstadGuide.publicationDate}. <strong>Enlace verificado:</strong> {sourcesVerifiedAt}.</p>
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
                  {sources.randstadProjection.publicationDate}.
                </p>
                <p><strong>Enlace verificado:</strong> {sourcesVerifiedAt}.</p>
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
