"use client";

import { useState } from "react";
import { CommercialCta, CommercialFooter, CommercialHeader } from "../components/CommercialTools";
import styles from "../commercialTools.module.css";

type AmountField = "current" | "floor" | "offer";

const amountFields: { id: AmountField; label: string; helper: string }[] = [
  { id: "current", label: "Remuneración actual (opcional)", helper: "Usá el mismo criterio neto o bruto que para el resto de los importes." },
  { id: "floor", label: "Piso personal (opcional)", helper: "El mínimo que definís para evaluar una propuesta." },
  { id: "offer", label: "Oferta recibida (opcional)", helper: "Se compara con tus propios valores, no con promedios de mercado." },
];

function parseAmount(rawValue: string): number | null {
  if (rawValue.trim() === "") return null;
  const amount = Number(rawValue);
  return Number.isFinite(amount) && amount >= 0 ? amount : Number.NaN;
}

export default function SalaryTool() {
  const [salaryType, setSalaryType] = useState<"neto" | "bruto">("neto");
  const [values, setValues] = useState<Record<AmountField, string>>({ current: "", floor: "", offer: "" });
  const [targetPercent, setTargetPercent] = useState("");

  const current = parseAmount(values.current);
  const floor = parseAmount(values.floor);
  const offer = parseAmount(values.offer);
  const percent = targetPercent.trim() === "" ? null : Number(targetPercent);
  const invalidAmounts = [current, floor, offer].some((value) => typeof value === "number" && !Number.isFinite(value));
  const invalidPercent = percent !== null && (!Number.isFinite(percent) || percent < 0);
  const hasError = invalidAmounts || invalidPercent;
  const target = !hasError && current !== null && percent !== null ? current * (1 + percent / 100) : null;
  const formatter = new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 2 });
  const money = (amount: number) => formatter.format(amount);
  const offerVsCurrent = offer !== null && current !== null && current > 0 ? ((offer - current) / current) * 100 : null;
  const offerVsTarget = offer !== null && target !== null ? offer - target : null;
  const offerVsFloor = offer !== null && floor !== null ? offer - floor : null;

  function updateAmount(field: AmountField, value: string) {
    setValues((previous) => ({ ...previous, [field]: value }));
  }

  return (
    <>
      <CommercialHeader current="/salario" />
      <main className={styles.page}>
        <section className={`shell ${styles.hero}`}>
          <div className="eyebrow">TU MATCH PROFESIONAL · HERRAMIENTA GRATUITA</div>
          <h1>Ordená tus números para evaluar una oferta.</h1>
          <p>Definí tus propios valores objetivo y piso. La calculadora muestra las operaciones realizadas y no estima ni inventa referencias salariales de mercado.</p>
        </section>

        <div className={`shell ${styles.content}`}>
          <section className={styles.card} aria-labelledby="salary-inputs-title">
            <h2 id="salary-inputs-title">Tus importes y objetivo</h2>
            <div className={styles.fieldGrid}>
              <div className={styles.field}>
                <label htmlFor="salary-type">Tipo de remuneración</label>
                <select id="salary-type" className={styles.input} value={salaryType} onChange={(event) => setSalaryType(event.target.value as "neto" | "bruto")}>
                  <option value="neto">Neta</option>
                  <option value="bruto">Bruta</option>
                </select>
              </div>
              <div className={styles.field}>
                <label htmlFor="salary-target-percent">Porcentaje objetivo sobre la remuneración actual</label>
                <input id="salary-target-percent" className={styles.input} type="number" min="0" step="any" inputMode="decimal" value={targetPercent} onChange={(event) => setTargetPercent(event.target.value)} placeholder="Ej.: 20" />
              </div>
              {amountFields.map((field) => (
                <div className={styles.field} key={field.id}>
                  <label htmlFor={`salary-${field.id}`}>{field.label}</label>
                  <input id={`salary-${field.id}`} className={styles.input} type="number" min="0" step="any" inputMode="decimal" value={values[field.id]} onChange={(event) => updateAmount(field.id, event.target.value)} placeholder="Importe en ARS" />
                  <p className={styles.resultIntro}>{field.helper}</p>
                </div>
              ))}
            </div>
            <p className={styles.hint}>Compará importes del mismo período y expresados con el mismo criterio. La herramienta no convierte entre neto y bruto ni incluye componentes variables, beneficios o descuentos.</p>
            {hasError && <p className={styles.error} role="alert">Ingresá importes y porcentajes válidos, iguales o mayores que cero. Si usás importes decimales, usá el punto como separador.</p>}
          </section>

          <section className={`${styles.card} ${styles.results}`} aria-live="polite" aria-labelledby="salary-results-title">
            <h2 id="salary-results-title">Resultado transparente</h2>
            <p className={styles.resultIntro}>Los resultados usan únicamente los importes que ingresaste. Valores expresados como {salaryType === "neto" ? "netos" : "brutos"} en pesos argentinos (ARS).</p>
            <p className={styles.hint}>Objetivo = remuneración actual × (1 + porcentaje objetivo ÷ 100). Se calcula solo si ingresás una remuneración actual y un porcentaje.</p>
            {target !== null && (
              <div className={styles.metricGrid}>
                <div className={styles.metric}><span>Remuneración actual ingresada</span><strong>{money(current!)}</strong></div>
                <div className={styles.metric}><span>Objetivo ({money(current!)} × (1 + {percent}% ÷ 100))</span><strong>{money(target)}</strong></div>
                <div className={styles.metric}><span>Piso personal ingresado</span><strong>{floor === null || !Number.isFinite(floor) ? "No indicado" : money(floor)}</strong></div>
              </div>
            )}
            {current === null && !hasError && <p className={styles.resultIntro}>Ingresá tu remuneración actual para calcular un importe objetivo a partir del porcentaje.</p>}
            {offer !== null && Number.isFinite(offer) && !hasError && (
              <div className={styles.metricGrid}>
                <div className={styles.metric}>
                  <span>Oferta ingresada</span><strong>{money(offer)}</strong>
                  {current !== null && <span>Variación frente a la remuneración actual: {money(offer - current)}{offerVsCurrent === null ? "." : ` (${offerVsCurrent.toFixed(2)}%).`}</span>}
                </div>
                {offerVsTarget !== null && <div className={styles.metric}><span>Oferta menos objetivo ({money(offer)} − {money(target!)})</span><strong>{money(offerVsTarget)}</strong></div>}
                {offerVsFloor !== null && <div className={styles.metric}><span>Oferta menos piso personal ({money(offer)} − {money(floor!)})</span><strong>{money(offerVsFloor)}</strong><span>{offerVsFloor >= 0 ? "La oferta alcanza o supera el piso que definiste." : "La oferta queda debajo del piso que definiste."}</span></div>}
              </div>
            )}
            {offer === null && !hasError && <p className={styles.resultIntro}>Si recibiste una propuesta, ingresala para compararla con tu objetivo, tu remuneración actual y/o tu piso personal.</p>}
          </section>

          <p className={styles.resultIntro}>Es una herramienta aritmética para ordenar una conversación y tus prioridades; no constituye una recomendación sobre aceptar o rechazar una oferta.</p>
          <CommercialCta />
        </div>
      </main>
      <CommercialFooter />
    </>
  );
}
