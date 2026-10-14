"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { trackAnalyticsEvent } from "../../lib/analytics";
import {
  AXIS_LABEL, CRITERIA, LEVELS, LEVEL_LABEL, SCALE, THRESHOLD_TEXT, evaluate,
  type Answers, type Axis,
} from "../../lib/ninebox";
import { CommercialCta, CommercialFooter, CommercialHeader } from "../components/CommercialTools";
import commercial from "../commercialTools.module.css";
import styles from "./nineBox.module.css";

const GROUPS: { axis: Axis; title: string; help: string }[] = [
  { axis: "desempeno", title: "Desempeño actual", help: "Pensá en cómo vienen siendo tus resultados en tu puesto actual durante el último año." },
  { axis: "potencial", title: "Potencial de crecimiento", help: "Pensá en tu capacidad, tu aspiración y tu compromiso hacia el futuro, no solo en lo que hacés hoy." },
];

export default function NineBoxTool() {
  // Las respuestas viven solo en el estado de esta página: no se guardan en el navegador ni se envían a ningún lado.
  const [answers, setAnswers] = useState<Answers>({});
  const [showResult, setShowResult] = useState(false);
  const started = useRef(false);

  useEffect(() => { trackAnalyticsEvent("tool_open_ninebox"); }, []);

  const answered = CRITERIA.filter((c) => answers[c.id] !== undefined).length;
  const complete = answered === CRITERIA.length;
  const result = useMemo(() => (showResult ? evaluate(answers) : null), [showResult, answers]);

  function answer(id: string, value: number) {
    if (!started.current) { started.current = true; trackAnalyticsEvent("ninebox_started"); }
    setAnswers((previous) => ({ ...previous, [id]: value }));
    setShowResult(false);
  }

  function calculate() {
    if (!complete) return;
    setShowResult(true);
    trackAnalyticsEvent("ninebox_result_generated"); // solo el nombre del evento, nunca las respuestas ni el cuadrante
    setTimeout(() => document.getElementById("nb-result")?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  }

  function restart() {
    setAnswers({});
    setShowResult(false);
    started.current = false;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <>
      <CommercialHeader current="/nine-box" />
      <main className={commercial.page}>
        <section className={`shell ${commercial.hero}`}>
          <div className="eyebrow">TU MATCH PROFESIONAL · AUTOEVALUACIÓN</div>
          <h1>Estimá tu cuadrante Nine Box.</h1>
          <p>Respondé 12 afirmaciones sobre tu desempeño y tu potencial. Calculamos tu cuadrante actual, te lo explicamos y te sugerimos próximos pasos de desarrollo. Tus respuestas se procesan en este navegador y no se guardan.</p>
        </section>

        <div className={`shell ${commercial.content}`}>
          <aside className={styles.banner} role="note">
            <strong>Versión de trabajo · propuesta nueva</strong>
            Las preguntas, la escala, los umbrales y los textos de esta página son una propuesta pendiente de validación y no corresponden al instrumento original de CR Gestión con Resultados.
          </aside>

          <section className={commercial.card} aria-labelledby="nb-form-title">
            <h2 id="nb-form-title">Tu autoevaluación</h2>
            <div className={styles.scaleLegend} aria-label="Escala de respuesta">
              {SCALE.map((s) => <span key={s.value}><b>{s.value}</b> = {s.label}</span>)}
            </div>

            {GROUPS.map((group) => (
              <fieldset className={styles.group} key={group.axis}>
                <legend>{group.title}</legend>
                <p className={styles.groupHelp}>{group.help}</p>
                {CRITERIA.filter((c) => c.axis === group.axis).map((criterion, index) => (
                  <div className={styles.question} key={criterion.id} role="radiogroup" aria-labelledby={`q-${criterion.id}`}>
                    {criterion.dimension && <span className={commercial.tag}>{criterion.dimension}</span>}
                    <p id={`q-${criterion.id}`}>{index + 1}. {criterion.text}</p>
                    <div className={styles.options}>
                      {SCALE.map((s) => (
                        <label className={styles.option} key={s.value}>
                          <input type="radio" name={`q-${criterion.id}`} value={s.value} checked={answers[criterion.id] === s.value} onChange={() => answer(criterion.id, s.value)} aria-label={`${s.value}: ${s.label}`} />
                          <span>{s.value}<small>{s.label}</small></span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </fieldset>
            ))}

            <p className={styles.progress} aria-live="polite">Respondiste {answered} de {CRITERIA.length} afirmaciones.</p>
            <div className={commercial.actions}>
              <button className={commercial.button} type="button" onClick={calculate} disabled={!complete}>Calcular mi cuadrante</button>
              <button className={commercial.subtleLink} type="button" onClick={restart} style={{ background: "none", border: 0, cursor: "pointer" }}>Reiniciar evaluación</button>
            </div>
            {!complete && <p className={commercial.hint}>Respondé todas las afirmaciones para ver tu resultado.</p>}
          </section>

          {result && (
            <section className={`${commercial.card} ${commercial.results}`} id="nb-result" data-testid="ninebox-result" aria-labelledby="nb-result-title">
              <h2 id="nb-result-title" data-testid="ninebox-quadrant">Tu cuadrante: Desempeño {LEVEL_LABEL[result.desempeno.level].toLowerCase()} · Potencial {LEVEL_LABEL[result.potencial.level].toLowerCase()}</h2>
              <p className={commercial.resultIntro}>{result.explanation}</p>

              <div className={commercial.metricGrid}>
                {(["desempeno", "potencial"] as const).map((axis) => (
                  <div className={commercial.metric} key={axis} data-testid={`ninebox-${axis}`}>
                    <span>{AXIS_LABEL[axis]}</span>
                    <strong>{LEVEL_LABEL[result[axis].level]}</strong>
                    <span>Suma {result[axis].sum} de 30 · promedio {result[axis].mean.toFixed(1).replace(".", ",")} de 5</span>
                  </div>
                ))}
              </div>

              <table className={styles.matrix}>
                <caption>Matriz Nine Box: desempeño en las columnas, potencial en las filas.</caption>
                <thead>
                  <tr><th scope="col"><span className={styles.srOnly}>Potencial / Desempeño</span></th>{LEVELS.map((level) => <th scope="col" key={level}>Desempeño {LEVEL_LABEL[level].toLowerCase()}</th>)}</tr>
                </thead>
                <tbody>
                  {[0, 1, 2].map((row) => {
                    const potencialLevel = LEVELS[2 - row];
                    return (
                      <tr key={row}>
                        <th scope="row">Potencial {LEVEL_LABEL[potencialLevel].toLowerCase()}</th>
                        {LEVELS.map((level, column) => {
                          const active = result.row === row && result.column === column;
                          return <td key={level} className={active ? styles.active : undefined} data-active={active ? "true" : undefined} aria-current={active ? "true" : undefined}>{active ? "Tu cuadrante" : `D. ${LEVEL_LABEL[level].toLowerCase()} · P. ${LEVEL_LABEL[potencialLevel].toLowerCase()}`}</td>;
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              <h3>Sugerencias de desarrollo</h3>
              <ul className={styles.list}>{result.suggestions.map((s) => <li key={s}>{s}</li>)}</ul>

              <h3>Criterios con menor puntaje</h3>
              {(["desempeno", "potencial"] as const).map((axis) => (
                <p className={commercial.resultIntro} key={axis}>
                  <strong>{AXIS_LABEL[axis]}:</strong>{" "}
                  {result[axis].focus.length ? result[axis].focus.map((c) => c.text).join(" · ") : "ningún criterio quedó por debajo de 4."}
                </p>
              ))}

              <p className={commercial.hint}>
                <strong>Cómo se calcula (propuesta):</strong> cada eje suma 6 respuestas de 1 a 5. {THRESHOLD_TEXT} El cuadrante surge de combinar ambos niveles.
                Es una autoevaluación orientativa: la autopercepción puede diferir de la de terceros y, en la práctica, el Nine Box suele calibrarse con la mirada de la jefatura y otras evidencias.
              </p>
              <div className={commercial.actions}>
                <button className={commercial.button} type="button" onClick={restart}>Reiniciar evaluación</button>
              </div>
            </section>
          )}

          <CommercialCta />
        </div>
      </main>
      <CommercialFooter />
    </>
  );
}
