"use client";

import { useState } from "react";
import { trackAnalyticsEventOnce } from "../../lib/analytics";
import { BASIC_DEDUCTION_RATES, netToGross } from "../../lib/salaryNet";
import styles from "../commercialTools.module.css";

const formatter = new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 2 });
const money = (amount: number) => formatter.format(amount);
const pct = (rate: number) => `${(rate * 100).toFixed(0)} %`;

export default function NetToGross() {
  // El importe vive solo en esta página: no se guarda ni se envía.
  const [input, setInput] = useState("");
  const parsed = Number(input);
  const hasValue = input.trim() !== "";
  const isValid = hasValue && Number.isFinite(parsed) && parsed >= 0;
  const result = isValid ? netToGross(parsed) : null;

  return (
    <section className={styles.card} aria-labelledby="net-to-gross-title">
      <h2 id="net-to-gross-title">Si te ofrecieron un sueldo neto: ¿cuál sería el bruto?</h2>
      <p className={styles.resultIntro}>
        Un importe <strong>neto</strong> es lo que queda en tu cuenta después de los descuentos. El <strong>bruto</strong> es el valor antes de esos descuentos.
        Esta estimación hace el camino inverso al cálculo de arriba: parte del neto y calcula qué bruto lo produciría con los mismos descuentos básicos.
      </p>
      <div className={styles.fieldGrid}>
        <div className={styles.field}>
          <label htmlFor="net-salary">Sueldo neto mensual</label>
          <input
            className={styles.input}
            id="net-salary"
            type="number"
            inputMode="decimal"
            min="0"
            step="0.01"
            placeholder="Ej.: 830000"
            value={input}
            onChange={(event) => { setInput(event.target.value); if (event.target.value.trim() !== "") trackAnalyticsEventOnce("salary_result_generated"); }}
            aria-describedby="net-salary-help"
            aria-invalid={hasValue && !isValid}
          />
          <p id="net-salary-help">Ingresá el importe en pesos que cobrarías en mano. Se calcula en este navegador y no se guarda.</p>
        </div>
      </div>
      {hasValue && !isValid && <p className={styles.error} role="alert">Ingresá un importe válido, igual o mayor que cero.</p>}
      {result && (
        <div className={styles.metricGrid} aria-live="polite" data-testid="net-to-gross-result">
          <div className={styles.metric}><span>Neto ingresado</span><strong>{money(result.net)}</strong></div>
          <div className={styles.metric}><span>Bruto equivalente estimado (mínimo)</span><strong data-testid="gross-equivalent">{money(result.gross)}</strong></div>
          <div className={styles.metric}><span>Aporte jubilatorio estimado · {pct(BASIC_DEDUCTION_RATES.retirement)}</span><strong>{money(result.retirement)}</strong></div>
          <div className={styles.metric}><span>Obra social estimada · {pct(BASIC_DEDUCTION_RATES.health)}</span><strong>{money(result.health)}</strong></div>
          <div className={styles.metric}><span>PAMI / INSSJP estimado · {pct(BASIC_DEDUCTION_RATES.inssjp)}</span><strong>{money(result.inssjp)}</strong></div>
          <div className={styles.metric}><span>Total de descuentos básicos estimados</span><strong>{money(result.totalDeductions)}</strong></div>
        </div>
      )}
      <p className={styles.hint}>
        <strong>Cómo se calcula:</strong> bruto = neto ÷ (1 − 0,17), porque los descuentos básicos suman el 17 % del bruto (11 % + 3 % + 3 %).
        <strong> Supuestos y límites:</strong> si además hay retenciones de Impuesto a las Ganancias, aportes sindicales, cuotas u otros descuentos, el bruto real sería <em>mayor</em> que este valor.
        Tampoco se consideran topes, bases imponibles ni conceptos no remunerativos. Es una estimación orientativa, no una liquidación de haberes: para conocer el bruto exacto, pedí el detalle a quien te hizo la oferta.
      </p>
    </section>
  );
}
