"use client";

import { useState } from "react";
import { trackAnalyticsEventOnce } from "../../lib/analytics";
import { compareSalary } from "../../lib/salaryComparison";
import styles from "../commercialTools.module.css";

type AmountField = "current" | "floor" | "offer";

const amountFields: { id: AmountField; label: string; helper: string }[] = [
  { id: "current", label: "Remuneración actual (opcional)", helper: "Usá el mismo criterio neto o bruto que para el resto de los importes." },
  { id: "floor", label: "Piso personal (opcional)", helper: "El mínimo que definís para evaluar una propuesta." },
  { id: "offer", label: "Oferta recibida (opcional)", helper: "Se compara con tus propios valores, no con promedios de mercado." },
];

const formatter = new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 2 });
const money = (amount: number) => formatter.format(amount);

export default function OfferComparison() {
  const [salaryType, setSalaryType] = useState<"neto" | "bruto">("neto");
  const [values, setValues] = useState<Record<AmountField, string>>({ current: "", floor: "", offer: "" });
  const [targetPercent, setTargetPercent] = useState("");

  const result = compareSalary(values.current, values.floor, values.offer, targetPercent);
  const { current, floor, offer, percent, hasError, target } = result;

  // Los importes nunca se envían a la analítica: solo el nombre del evento.
  function markStarted() { trackAnalyticsEventOnce("salary_started"); }
  function updateAmount(field: AmountField, value: string) {
    markStarted();
    setValues((previous) => ({ ...previous, [field]: value }));
    if (value.trim() !== "") trackAnalyticsEventOnce("salary_result_generated");
  }

  return (
    <>
      <section className={styles.card} aria-labelledby="salary-inputs-title">
        <h2 id="salary-inputs-title">Compará una oferta con tus propios valores</h2>
        <p className={styles.resultIntro}>Definí tu objetivo y tu piso. La comparación muestra las operaciones realizadas con los importes que ingresás: no estima ni inventa referencias salariales de mercado. Todo se calcula en este navegador y no se guarda.</p>
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
            <input id="salary-target-percent" className={styles.input} type="number" min="0" step="any" inputMode="decimal" value={targetPercent} onChange={(event) => { markStarted(); setTargetPercent(event.target.value); }} placeholder="Ej.: 20" />
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
              {current !== null && <span>Variación frente a la remuneración actual: {money(result.offerMinusCurrent!)}{result.offerVsCurrentPercent === null ? "." : ` (${result.offerVsCurrentPercent.toFixed(2).replace(".", ",")}%).`}</span>}
            </div>
            {result.offerMinusTarget !== null && <div className={styles.metric}><span>Oferta menos objetivo ({money(offer)} − {money(target!)})</span><strong>{money(result.offerMinusTarget)}</strong></div>}
            {result.offerMinusFloor !== null && <div className={styles.metric}><span>Oferta menos piso personal ({money(offer)} − {money(floor!)})</span><strong>{money(result.offerMinusFloor)}</strong><span>{result.offerMinusFloor >= 0 ? "La oferta alcanza o supera el piso que definiste." : "La oferta queda debajo del piso que definiste."}</span></div>}
          </div>
        )}
        {offer === null && !hasError && <p className={styles.resultIntro}>Si recibiste una propuesta, ingresala para compararla con tu objetivo, tu remuneración actual y/o tu piso personal.</p>}
        <p className={styles.resultIntro}>Es una herramienta aritmética para ordenar una conversación y tus prioridades; no constituye una recomendación sobre aceptar o rechazar una oferta.</p>
      </section>
    </>
  );
}
