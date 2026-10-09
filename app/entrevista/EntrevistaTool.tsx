"use client";

import { useEffect, useMemo, useState } from "react";
import { trackAnalyticsEvent } from "../../lib/analytics";
import {
  COMPETENCIES, COMPETENCY_ORDER, DECISIONS, LEVELS, POSITIONS, SCORE_LABELS,
  type CompetencyId, type Decision,
} from "../../lib/entrevista";
import "./entrevista.css";

const WHATSAPP_URL = `https://wa.me/5491124895402?text=${encodeURIComponent("Hola Carla, utilicé el Generador de Entrevistas por Competencias y quiero consultar por un proceso de selección.")}`;
const trackWhatsapp = () => trackAnalyticsEvent("whatsapp_click_entrevista");

type Guide = { positionName: string; levelName: string; levelFocus: string; competencies: CompetencyId[]; context: { industria: string; turnos: string; equipo: string; responsabilidades: string; requisitos: string } };

export default function EntrevistaTool() {
  const [positionId, setPositionId] = useState("");
  const [levelId, setLevelId] = useState("");
  const [custom, setCustom] = useState<CompetencyId[]>([]);
  const [ctx, setCtx] = useState({ industria: "", turnos: "", equipo: "", responsabilidades: "", requisitos: "" });
  const [error, setError] = useState("");
  const [guide, setGuide] = useState<Guide | null>(null);
  const [scores, setScores] = useState<Partial<Record<CompetencyId, number>>>({});
  const [notes, setNotes] = useState<Partial<Record<CompetencyId, string>>>({});
  const [decision, setDecision] = useState<Decision | "">("");
  const [meta, setMeta] = useState({ candidato: "", entrevistador: "", fecha: "", conclusion: "" });
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => { trackAnalyticsEvent("tool_open_entrevista"); }, []);

  const position = POSITIONS.find((p) => p.id === positionId);
  const isOther = positionId === "otro";

  function toggleCustom(id: CompetencyId) {
    setError("");
    setCustom((prev) => prev.includes(id) ? prev.filter((c) => c !== id) : prev.length >= 4 ? prev : [...prev, id]);
  }

  function generate() {
    if (!position) { setError("Elegí un puesto para continuar."); return; }
    if (!levelId) { setError("Elegí el nivel del puesto."); return; }
    if (isOther && custom.length < 2) { setError("Para \"Otro puesto\", elegí entre 2 y 4 competencias a evaluar."); return; }
    const level = LEVELS.find((l) => l.id === levelId)!;
    setError(""); setScores({}); setNotes({}); setDecision("");
    trackAnalyticsEvent("interview_generated");
    setGuide({ positionName: position.name, levelName: level.name, levelFocus: level.focus, competencies: isOther ? custom : position.competencies, context: ctx });
    setTimeout(() => document.getElementById("guia")?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  }

  function reset() { setGuide(null); setScores({}); setNotes({}); setDecision(""); window.scrollTo({ top: 0, behavior: "smooth" }); }

  const scored = useMemo(() => Object.values(scores).filter((v): v is number => typeof v === "number"), [scores]);
  const average = scored.length ? (scored.reduce((a, b) => a + b, 0) / scored.length).toFixed(1) : null;
  const ctxEntries = guide ? ([["Industria", guide.context.industria], ["Turnos", guide.context.turnos], ["Equipo", guide.context.equipo], ["Responsabilidades", guide.context.responsabilidades], ["Requisitos particulares", guide.context.requisitos]] as const).filter(([, v]) => v.trim()) : [];

  return <main className="interview-page">
    <header className="topbar no-print"><div className="shell topbar-inner"><a className="brand" href="/" aria-label="CR Gestión con Resultados, Tu Match Profesional"><img src="/branding/logo-consultora.png" alt="CR Gestión con Resultados" /><span><strong>CR Gestión con Resultados</strong><small>Tu Match Profesional</small></span></a><button className="menu-toggle" type="button" aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"} aria-expanded={isMenuOpen} onClick={() => setIsMenuOpen(!isMenuOpen)}><span /><span /><span /></button><nav className={isMenuOpen ? "main-nav is-open" : "main-nav"} aria-label="Navegación principal"><a href="/">Inicio</a><a href="/preparar-entrevista">Preparar entrevista</a><a href="/salario">Salario</a><a href="/recursos">Recursos</a><a className="whatsapp-header-button" href={WHATSAPP_URL} target="_blank" rel="noreferrer" onClick={trackWhatsapp}>Hablar por WhatsApp</a></nav></div></header>

    <section className="hero shell no-print" id="inicio"><div className="hero-copy"><a className="iv-back" href="/">← Volver a Tu Match Profesional</a><div className="eyebrow">TU MATCH PROFESIONAL · HERRAMIENTA GRATUITA</div><h1>Entrevistas por competencias <em>con evidencia, no con impresiones.</em></h1><p>Armá en segundos una guía de entrevista estructurada para el puesto que necesitás cubrir. Sin registro y sin costo.</p><div className="hero-benefits"><span>✓ Enfoque STAR</span><span>✓ Preguntas y repreguntas</span><span>✓ Puntuación 1 a 5</span><span>✓ Imprimí o guardá en PDF</span></div></div></section>

    <section className="workspace shell no-print">
      <div className="analysis-card">
        <div className="analysis-card-header"><div><div className="eyebrow">CONFIGURÁ TU GUÍA</div><h2>¿Para qué puesto vas a entrevistar?</h2></div><span className="analysis-card-note">No se guarda ningún dato: todo queda en tu navegador</span></div>
        <div className="iv-grid">
          <div className="panel"><div className="panel-heading"><div><span className="step">01</span><div><h2>Puesto</h2><small>Define las competencias a evaluar</small></div></div><span className="required">Obligatorio</span></div>
            <label htmlFor="puesto">Elegí un puesto</label>
            <select id="puesto" className="iv-input" value={positionId} onChange={(e) => { setPositionId(e.target.value); setError(""); }}><option value="">Seleccionar…</option>{POSITIONS.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</select>
            {position && !isOther && <div className="iv-chips" aria-label="Competencias del puesto">{position.competencies.map((c) => <span key={c}>{COMPETENCIES[c].name}</span>)}</div>}
            {isOther && <div className="iv-custom"><p>Elegí entre 2 y 4 competencias ({custom.length}/4):</p><div className="iv-checks">{COMPETENCY_ORDER.map((c) => <label key={c} className={custom.includes(c) ? "is-on" : ""}><input type="checkbox" checked={custom.includes(c)} onChange={() => toggleCustom(c)} disabled={!custom.includes(c) && custom.length >= 4} />{COMPETENCIES[c].name}</label>)}</div></div>}
          </div>
          <div className="panel"><div className="panel-heading"><div><span className="step">02</span><div><h2>Nivel</h2><small>Ajusta el foco de la entrevista</small></div></div><span className="required">Obligatorio</span></div>
            <label htmlFor="nivel">Elegí el nivel</label>
            <select id="nivel" className="iv-input" value={levelId} onChange={(e) => { setLevelId(e.target.value); setError(""); }}><option value="">Seleccionar…</option>{LEVELS.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}</select>
            {levelId && <p className="iv-hint">{LEVELS.find((l) => l.id === levelId)?.focus}</p>}
          </div>
          <div className="panel iv-wide"><div className="panel-heading"><div><span className="step">03</span><div><h2>Contexto</h2><small>Opcional · agregá información sobre la posición, industria, turnos, equipo o responsabilidades específicas</small></div></div><span className="required">Opcional</span></div>
            <div className="iv-context">
              <div><label htmlFor="industria">Industria</label><input id="industria" className="iv-input" value={ctx.industria} onChange={(e) => setCtx({ ...ctx, industria: e.target.value })} placeholder="Ej.: alimenticia, retail, logística" /></div>
              <div><label htmlFor="turnos">Turnos</label><input id="turnos" className="iv-input" value={ctx.turnos} onChange={(e) => setCtx({ ...ctx, turnos: e.target.value })} placeholder="Ej.: rotativos, nocturno" /></div>
              <div><label htmlFor="equipo">Equipo</label><input id="equipo" className="iv-input" value={ctx.equipo} onChange={(e) => setCtx({ ...ctx, equipo: e.target.value })} placeholder="Ej.: 12 personas, reporta a Jefatura" /></div>
              <div className="iv-span"><label htmlFor="resp">Responsabilidades</label><textarea id="resp" className="iv-input" rows={2} value={ctx.responsabilidades} onChange={(e) => setCtx({ ...ctx, responsabilidades: e.target.value })} placeholder="Principales tareas del puesto" /></div>
              <div className="iv-span"><label htmlFor="req">Requisitos particulares</label><textarea id="req" className="iv-input" rows={2} value={ctx.requisitos} onChange={(e) => setCtx({ ...ctx, requisitos: e.target.value })} placeholder="Ej.: disponibilidad horaria, carnet de autoelevador" /></div>
            </div>
          </div>
          <div className="form-actions">{error && <div className="error-message" role="alert">{error}</div>}<button className="primary-button" type="button" onClick={generate}>Generar guía de entrevista<span>→</span></button></div>
        </div>
      </div>
    </section>

    {guide && <section className="shell iv-guide" id="guia" aria-live="polite">
      <div className="iv-print-brand"><img src="/branding/logo-consultora.png" alt="" /><div><strong>CR Gestión con Resultados</strong><span>Tu Match Profesional · Guía de entrevista por competencias</span></div></div>
      <div className="results-header"><div><div className="eyebrow">TU GUÍA DE ENTREVISTA</div><h2>{guide.positionName} · {guide.levelName}</h2><p>{guide.competencies.length} competencias · enfoque STAR · puntuación 1 a 5</p></div><div className="iv-actions no-print"><button className="text-button" type="button" onClick={reset}>Nueva guía <span>↗</span></button><button className="primary-button iv-print" type="button" onClick={() => window.print()}>Imprimir / Guardar PDF</button></div></div>

      {ctxEntries.length > 0 && <div className="iv-box iv-ctx"><strong>Contexto de la búsqueda</strong><dl>{ctxEntries.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl></div>}

      <div className="iv-meta"><div><label htmlFor="cand">Candidato/a</label><input id="cand" className="iv-input" value={meta.candidato} onChange={(e) => setMeta({ ...meta, candidato: e.target.value })} /><span className="print-only">{meta.candidato}</span></div><div><label htmlFor="entr">Entrevistador/a</label><input id="entr" className="iv-input" value={meta.entrevistador} onChange={(e) => setMeta({ ...meta, entrevistador: e.target.value })} /><span className="print-only">{meta.entrevistador}</span></div><div><label htmlFor="fecha">Fecha</label><input id="fecha" type="date" className="iv-input" value={meta.fecha} onChange={(e) => setMeta({ ...meta, fecha: e.target.value })} /><span className="print-only">{meta.fecha}</span></div></div>

      <div className="iv-box iv-method"><div><strong>Cómo usar esta guía</strong><p>{guide.levelFocus}</p></div>
        <div className="iv-star"><span><b>S</b>Situación</span><span><b>T</b>Tarea</span><span><b>A</b>Acción</span><span><b>R</b>Resultado</span></div>
        <p className="iv-warning"><b>No evalúes solamente si la persona te cae bien. Buscá ejemplos concretos de conductas y resultados.</b> Registrá hechos, acciones y resultados que el/la candidato/a describa. Evitá anotar impresiones como “me cayó bien”, “me pareció responsable” o “tenía buena actitud”: no son evidencia y generan sesgos.</p></div>

      {guide.competencies.map((id, index) => {
        const c = COMPETENCIES[id]; const score = scores[id];
        return <article className="iv-comp" key={id}>
          <header><span className="iv-num">{String(index + 1).padStart(2, "0")}</span><div><h3>{c.name}</h3><p>{c.focus}</p></div></header>
          <div className="iv-cols">
            <div><h4>Preguntas conductuales</h4><ol>{c.questions.map((q) => <li key={q}>{q}</li>)}</ol><h4>Repreguntas (STAR)</h4><ul>{c.followUps.map((q) => <li key={q}>{q}</li>)}</ul></div>
            <div><h4>Evidencia esperada</h4><ul className="iv-good">{c.evidence.map((q) => <li key={q}>{q}</li>)}</ul><h4>Señales de alerta</h4><ul className="iv-bad">{c.redFlags.map((q) => <li key={q}>{q}</li>)}</ul></div>
          </div>
          <div className="iv-score"><div className="iv-score-label">Puntuación{score ? ` · ${SCORE_LABELS[score]}` : ""}</div><div className="iv-score-btns" role="radiogroup" aria-label={`Puntuación de ${c.name}`}>{[1, 2, 3, 4, 5].map((n) => <button key={n} type="button" role="radio" aria-checked={score === n} className={score === n ? "is-on" : ""} onClick={() => setScores({ ...scores, [id]: n })}>{n}</button>)}</div></div>
          <label className="iv-notes-label" htmlFor={`nota-${id}`}>Notas (hechos observados, no impresiones)</label>
          <textarea id={`nota-${id}`} className="iv-input iv-notes" rows={3} value={notes[id] ?? ""} onChange={(e) => setNotes({ ...notes, [id]: e.target.value })} placeholder="Situación · Tarea · Acción · Resultado" />
          <div className="print-only iv-notes-print">{notes[id] || " "}</div>
        </article>;
      })}

      <div className="iv-box iv-final"><div><strong>Decisión final</strong>{average && <span className="iv-avg">Promedio: {average} / 5</span>}</div>
        <div className="iv-decisions" role="radiogroup" aria-label="Decisión final">{DECISIONS.map((d) => <button key={d} type="button" role="radio" aria-checked={decision === d} className={`${decision === d ? "is-on" : ""} d-${d === "Avanza" ? "ok" : d === "No avanza" ? "no" : "mid"}`} onClick={() => setDecision(d)}>{d}</button>)}</div>
        <label className="iv-notes-label" htmlFor="concl">Fundamento de la decisión</label>
        <textarea id="concl" className="iv-input iv-notes" rows={3} value={meta.conclusion} onChange={(e) => setMeta({ ...meta, conclusion: e.target.value })} placeholder="Resumí la evidencia que sustenta la decisión" />
        <div className="print-only iv-notes-print">{meta.conclusion || " "}</div>
        <div className="iv-summary"><strong>Resumen final</strong><table><thead><tr><th>Competencia</th><th>Puntaje</th></tr></thead><tbody>{guide.competencies.map((id) => <tr key={id}><td>{COMPETENCIES[id].name}</td><td>{scores[id] ? `${scores[id]} / 5 · ${SCORE_LABELS[scores[id]!]}` : "Sin puntuar"}</td></tr>)}</tbody></table><p>Promedio: <b>{average ? `${average} / 5` : "—"}</b> · Decisión: <b>{decision || "Sin definir"}</b></p></div>
      </div>

      <div className="no-print iv-print-row"><button className="primary-button iv-print" type="button" onClick={() => window.print()}>Imprimir / Guardar PDF</button><span>En el cuadro de impresión elegí “Guardar como PDF”.</span></div>
    </section>}

    <section className="shell no-print"><div className="landing-section landing-contact iv-cta"><div><div className="eyebrow">CR GESTIÓN CON RESULTADOS</div><h2>¿Necesitás un proceso de selección profesional?</h2><p>CR Gestión con Resultados diseña entrevistas estructuradas, procesos de selección y evaluación de candidatos.</p></div><a className="whatsapp-button" href={WHATSAPP_URL} target="_blank" rel="noreferrer" onClick={trackWhatsapp}>Hablar por WhatsApp →</a></div></section>

    <footer className="footer no-print"><div className="shell footer-inner"><div className="footer-brand"><img src="/branding/logo-consultora.png" alt="CR Gestión con Resultados" /><div><strong>CR Gestión con Resultados</strong><span>Consultora en Recursos Humanos y Optimización Operativa</span><span>Personas, procesos y resultados en equilibrio.</span></div></div><div className="footer-contact"><a href="mailto:cr.gestiondepersonas@gmail.com">cr.gestiondepersonas@gmail.com</a></div><div className="footer-bottom"><span>© CR Gestión con Resultados · Tu Match Profesional</span></div></div></footer>
  </main>;
}
