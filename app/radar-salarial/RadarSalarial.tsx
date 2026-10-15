"use client";

import { useEffect, useState } from "react";
import { trackAnalyticsEvent } from "../../lib/analytics";
import { RADAR_DATA, RADAR_POSITIONS, entriesFor, type RadarEntry } from "../../lib/radarSalarial";
import { CommercialCta, CommercialFooter, CommercialHeader } from "../components/CommercialTools";
import styles from "../commercialTools.module.css";

const money = (amount: number) => new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(amount);
const dateText = (iso: string) => new Date(`${iso}T12:00:00`).toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" });

export default function RadarSalarial({ data = RADAR_DATA }: { data?: RadarEntry[] }) {
  const [positionId, setPositionId] = useState("");
  const [started, setStarted] = useState(false);
  useEffect(() => { trackAnalyticsEvent("tool_open_radar"); }, []);

  const position = RADAR_POSITIONS.find((item) => item.id === positionId);
  const entries = position ? entriesFor(position.id, data) : [];

  return (
    <>
      <CommercialHeader current="/radar-salarial" />
      <main className={styles.page}>
        <section className={`shell ${styles.hero}`}>
          <div className="eyebrow">TU MATCH PROFESIONAL · RADAR SALARIAL</div>
          <h1>¿Cuánto paga el mercado por un puesto?</h1>
          <p>Consultá referencias de remuneración por puesto con su fuente, fecha, zona y nivel de confianza. Solo mostramos datos que podemos verificar: si no hay una referencia confiable, te lo decimos.</p>
        </section>

        <div className={`shell ${styles.content}`}>
          <section className={`${styles.card} ${styles.selector}`} aria-labelledby="radar-title">
            <h2 id="radar-title">Elegí un puesto</h2>
            <div className={styles.fieldGrid}>
              <div className={styles.field}>
                <label htmlFor="radar-position">Puesto</label>
                <select id="radar-position" className={styles.input} value={positionId} onChange={(event) => { setPositionId(event.target.value); if (!started && event.target.value) { setStarted(true); trackAnalyticsEvent("radar_search"); } }}>
                  <option value="">Seleccionar puesto</option>
                  {RADAR_POSITIONS.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
                </select>
              </div>
            </div>
            <p className={styles.hint}>Esto es distinto del cálculo de bruto y neto: acá consultás qué se paga en el mercado, no cuánto te quedaría de un sueldo. La selección no se guarda ni se envía.</p>
          </section>

          {position && entries.length === 0 && (
            <section className={styles.card} aria-live="polite" data-testid="radar-empty">
              <h2>{position.name}: todavía no hay una referencia confiable</h2>
              <p className={styles.resultIntro}>Para este puesto no contamos con datos validados que podamos mostrar. Preferimos no publicar una cifra antes que mostrar una que no podamos respaldar.</p>
              <p className={styles.hint}>Cuando se incorporen datos, cada referencia indicará: si es bruta o neta, el período, la zona, la experiencia y la jornada considerada, la fecha del dato, la fuente con su enlace, el tamaño de la muestra (si la fuente lo informa) y el nivel de confianza.</p>
              <p className={styles.hint}>Mientras tanto, podés consultar las publicaciones salariales de fuentes públicas que reunimos en <a href="/salario">Salario</a>, siempre contrastándolas con la oferta concreta que recibas.</p>
            </section>
          )}

          {position && entries.length > 0 && (
            <section aria-live="polite" data-testid="radar-results">
              <h2>{position.name}</h2>
              {entries.map((entry) => (
                <article className={styles.card} key={`${entry.sourceUrl}-${entry.sourceName}-${entry.sourceLabel}-${entry.max}`}>
                  <span className={styles.tag}>Confianza {entry.confidence}</span>
                  <div className={styles.metricGrid}>
                    {entry.reference !== undefined && entry.min !== entry.max && <div className={styles.metric}><span>Valor de referencia ({entry.referenceKind})</span><strong>{money(entry.reference)}</strong></div>}
                    <div className={styles.metric}><span>{entry.min === entry.max ? `Valor publicado (${entry.referenceKind})` : "Rango publicado"}</span><strong>{entry.min === entry.max ? money(entry.min) : `${money(entry.min)} a ${money(entry.max)}`}</strong></div>
                    <div className={styles.metric}><span>Tipo y período</span><strong>{entry.amountType === "bruto" ? "Bruto" : "Neto"} · {entry.period}</strong></div>
                  </div>
                  {entry.sourceLabel && <p><strong>Puesto según la fuente:</strong> {entry.sourceLabel}.</p>}
                  <p><strong>Zona:</strong> {entry.zone}. <strong>Experiencia:</strong> {entry.experience}. <strong>Jornada y modalidad:</strong> {entry.workload}.</p>
                  <p><strong>Fecha de la publicación:</strong> {dateText(entry.referenceDate)}. {entry.sampleSize ? <><strong>Muestra:</strong> {entry.sampleSize} casos. </> : "La fuente no informa el tamaño de la muestra. "}</p>
                  {entry.note && <p><strong>Aclaración de la fuente:</strong> {entry.note}</p>}
                  <p><strong>Fuente:</strong> <a href={entry.sourceUrl} target="_blank" rel="noopener noreferrer">{entry.sourceName} ↗</a></p>
                </article>
              ))}
              <p className={styles.hint}>Son referencias orientativas que medios reconocidos publicaron citando estudios salariales; no accedimos a los informes completos. La confianza indica si la fuente informa método y muestra: la mayoría no lo hace. Los importes se expresan con el símbolo $, que interpretamos como pesos argentinos. No constituyen una oferta, un piso ni una garantía de lo que pague una empresa en particular.</p>
            </section>
          )}

          <CommercialCta />
        </div>
      </main>
      <CommercialFooter />
    </>
  );
}
