"use client";

import { useState } from "react";
import { CommercialCta, CommercialFooter, CommercialHeader } from "../components/CommercialTools";
import styles from "../commercialTools.module.css";
import { EXPERIENCE_SOURCES, INTERVIEW_ROLES, SENIORITY_LEVELS, SMART_FIELDS } from "../../lib/prepararEntrevista";

type StarField = "situation" | "task" | "action" | "result";
type Answers = Record<string, Partial<Record<StarField, string>>>;

const starFields: { id: StarField; label: string; hint: string }[] = [
  { id: "situation", label: "S · Situación", hint: "¿Dónde y cuándo ocurrió? ¿Cuál era el contexto?" },
  { id: "task", label: "T · Tarea", hint: "¿Qué objetivo o responsabilidad tenías?" },
  { id: "action", label: "A · Acción", hint: "¿Qué hiciste vos, paso a paso?" },
  { id: "result", label: "R · Resultado", hint: "¿Qué cambió? ¿Qué aprendiste?" },
];

const starFeedback: Record<StarField, string> = {
  situation: "Ubicá el ejemplo: cuándo ocurrió, en qué contexto y cuál era el desafío.",
  task: "Aclarà cuál era tu responsabilidad y qué objetivo había que cumplir.",
  action: "Contá tus pasos y decisiones concretas; diferenciá tu aporte del del equipo.",
  result: "Cerrá con un efecto observable o un aprendizaje. Incluí cifras solo si las recordás y podés sostenerlas.",
};

function getStarFeedback(field: StarField, answer: string) {
  const words = answer.trim().split(/\s+/).filter(Boolean).length;
  if (words === 0) return `Todavía no escribiste esta parte. ${starFeedback[field]}`;
  if (words < 10) return `La respuesta es muy breve para ubicar el ejemplo. ${starFeedback[field]}`;
  if (words > 100) return `Podés resumirla para destacar lo principal. ${starFeedback[field]}`;
  if (field === "result" && /\d/.test(answer)) {
    return "Incluiste una cifra; agregá qué representa y cómo la obtuviste para dar contexto.";
  }
  return starFeedback[field];
}

type SmartField = (typeof SMART_FIELDS)[number]["id"];

function smartFeedback(answer: string) {
  const words = answer.trim().split(/\s+/).filter(Boolean).length;
  if (words === 0) return "Todavía no completaste este criterio.";
  if (words < 4) return "Es muy breve: sumá un detalle concreto.";
  return "Revisá que sea algo que puedas sostener con hechos.";
}

function SmartPractice() {
  // Lo que escribís queda solo en esta página: no se guarda ni se envía.
  const [goal, setGoal] = useState<Partial<Record<SmartField, string>>>({});
  return (
    <section className={styles.card} aria-labelledby="smart-title">
      <h2 id="smart-title">Formulá un objetivo concreto con SMART</h2>
      <p className={styles.resultIntro}>STAR te sirve para contar experiencias que ya viviste. SMART te sirve cuando te preguntan por tus objetivos o por cómo vas a aprender algo: te ayuda a decir algo concreto en lugar de una frase general como “quiero crecer”. Completá un objetivo real que tengas.</p>
      <div className={styles.starGrid}>
        {SMART_FIELDS.map((field) => (
          <div className={styles.starField} key={field.id}>
            <label htmlFor={`smart-${field.id}`}>{field.letter} · {field.name} · {field.hint}</label>
            <textarea id={`smart-${field.id}`} rows={2} value={goal[field.id] ?? ""} onChange={(event) => setGoal((previous) => ({ ...previous, [field.id]: event.target.value }))} />
            <p className={styles.hint}>Sugerencia para mejorar: {smartFeedback(goal[field.id] ?? "")}</p>
          </div>
        ))}
      </div>
      <p className={styles.hint}>Ejemplo orientativo: “En los próximos 3 meses quiero terminar un curso de Excel básico (específico), rindiendo las 4 evaluaciones (medible), con 5 horas por semana (alcanzable), para ordenar datos en un puesto administrativo (relevante), antes de fin de año (temporal)”. Es solo un modelo: usá tus propios datos.</p>
    </section>
  );
}

function NoExperience() {
  return (
    <section className={styles.card} aria-labelledby="noexp-title">
      <h2 id="noexp-title">¿Todavía no tenés experiencia laboral?</h2>
      <p className={styles.resultIntro}>Podés usar el método STAR con situaciones reales de otros ámbitos. A un entrevistador le sirve ver cómo pensás, cómo te organizás y cómo aprendés. Elegí ejemplos verdaderos: no hace falta que sean grandes ni inventar nada.</p>
      <ul className={styles.followUps}>
        {EXPERIENCE_SOURCES.map((source) => <li key={source.id}><strong>{source.name}:</strong> {source.prompt}</li>)}
      </ul>
      <p className={styles.hint}>Después de elegir una situación, elegí cualquier puesto y nivel “Inicial” y respondé las preguntas con ese ejemplo.</p>
    </section>
  );
}

export default function InterviewPractice() {
  const [roleId, setRoleId] = useState("");
  const [seniorityId, setSeniorityId] = useState("");
  const [answers, setAnswers] = useState<Answers>({});
  const role = INTERVIEW_ROLES.find((item) => item.id === roleId);
  const seniority = SENIORITY_LEVELS.find((item) => item.id === seniorityId);

  function changeRole(nextRoleId: string) {
    setRoleId(nextRoleId);
    setAnswers({});
  }

  function updateAnswer(questionIndex: number, field: StarField, value: string) {
    const key = `${roleId}-${questionIndex}`;
    setAnswers((previous) => ({
      ...previous,
      [key]: { ...previous[key], [field]: value },
    }));
  }

  return (
    <>
      <CommercialHeader current="/preparar-entrevista" />
      <main className={styles.page}>
        <section className={`shell ${styles.hero}`}>
          <div className="eyebrow">TU MATCH PROFESIONAL · PRÁCTICA GRATUITA</div>
          <h1>Prepará tu próxima entrevista con ejemplos concretos.</h1>
          <p>Elegí un puesto y un nivel para practicar respuestas con el método STAR. Las preguntas son disparadores orientativos: no predicen exactamente lo que preguntará una empresa.</p>
        </section>

        <div className={`shell ${styles.content}`}>
          <section className={`${styles.card} ${styles.selector}`} aria-labelledby="setup-title">
            <h2 id="setup-title">Elegí el puesto y el seniority</h2>
            <div className={styles.fieldGrid}>
              <div className={styles.field}>
                <label htmlFor="interview-role">Puesto</label>
                <select id="interview-role" className={styles.input} value={roleId} onChange={(event) => changeRole(event.target.value)}>
                  <option value="">Seleccionar puesto</option>
                  {INTERVIEW_ROLES.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
                </select>
              </div>
              <div className={styles.field}>
                <label htmlFor="interview-seniority">Seniority</label>
                <select id="interview-seniority" className={styles.input} value={seniorityId} onChange={(event) => setSeniorityId(event.target.value)}>
                  <option value="">Seleccionar nivel</option>
                  {SENIORITY_LEVELS.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
                </select>
              </div>
            </div>
            <p className={styles.hint}>Los nombres de seniority varían entre organizaciones. Usá el nivel como una referencia para ajustar el alcance de tus ejemplos, no como una regla por años de experiencia.</p>
          </section>

          <NoExperience />
          <SmartPractice />

          {role && seniority && (
            <section className={styles.results} aria-live="polite">
              <div className={styles.printBrand}>
                <img src="/branding/logo-cr-gestion.png" alt="" />
                <div><strong>CR Gestión con Resultados</strong><span>Tu Match Profesional · Preparación de entrevista</span></div>
              </div>
              <div className={`${styles.card} ${styles.noPrint}`}>
                <div className="eyebrow">FOCO PARA {seniority.name.toLocaleUpperCase("es-AR")}</div>
                <p>{seniority.focus}</p>
              </div>
              <div className={styles.noPrint}>
                <button className={styles.button} type="button" onClick={() => window.print()}>Imprimir / Guardar PDF</button>
                <p className={styles.resultIntro}>En el diálogo de impresión elegí “Guardar como PDF”. Tus respuestas permanecen en esta página; no se envían ni guardan en un servidor.</p>
              </div>
              <h2>{role.name} · {seniority.name}</h2>
              <p className={styles.resultIntro}>Estas preguntas son orientativas, no predicciones exactas. Enfocate en describir tu aporte real; no hace falta que el resultado haya sido perfecto.</p>

              {role.questions.map((question, questionIndex) => (
                <article className={styles.prompt} key={`${role.id}-${questionIndex}`}>
                  <span className={styles.tag}>Competencia: {question.competency}</span>
                  <h3>{questionIndex + 1}. {question.question}</h3>
                  <p><strong>Evidencia que podés buscar en tu experiencia:</strong> {question.evidence}</p>
                  <strong className={styles.tag}>Repreguntas para profundizar</strong>
                  <ul className={styles.followUps}>{question.followUps.map((followUp) => <li key={followUp}>{followUp}</li>)}</ul>
                  <div className={styles.starGrid}>
                    {starFields.map((field) => {
                      const id = `star-${role.id}-${questionIndex}-${field.id}`;
                      const answer = answers[`${role.id}-${questionIndex}`]?.[field.id] ?? "";
                      return (
                        <div className={styles.starField} key={field.id}>
                          <label htmlFor={id}>{field.label} · {field.hint}</label>
                          <textarea id={id} rows={3} value={answer} onChange={(event) => updateAnswer(questionIndex, field.id, event.target.value)} />
                          <p className={styles.hint}>Sugerencia para mejorar: {getStarFeedback(field.id, answer)}</p>
                        </div>
                      );
                    })}
                  </div>
                </article>
              ))}
              <p className={styles.hint}>
                La devolución es una guía automática de estructura STAR, no una evaluación profesional
                de la veracidad, calidad o adecuación de tus respuestas.
              </p>
              <div className={`${styles.noPrint} ${styles.actions}`}>
                <button className={styles.button} type="button" onClick={() => window.print()}>Imprimir / Guardar PDF</button>
                <a className={styles.subtleLink} href="/recursos#preparar-entrevista">Ver guía breve para preparar entrevistas →</a>
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
