"use client";

import { useState } from "react";
import { CommercialCta, CommercialFooter, CommercialHeader } from "../components/CommercialTools";
import styles from "../commercialTools.module.css";
import { INTERVIEW_ROLES, SENIORITY_LEVELS } from "../../lib/prepararEntrevista";

type StarField = "situation" | "task" | "action" | "result";
type Answers = Record<string, Partial<Record<StarField, string>>>;

const starFields: { id: StarField; label: string; hint: string }[] = [
  { id: "situation", label: "S · Situación", hint: "¿Dónde y cuándo ocurrió? ¿Cuál era el contexto?" },
  { id: "task", label: "T · Tarea", hint: "¿Qué objetivo o responsabilidad tenías?" },
  { id: "action", label: "A · Acción", hint: "¿Qué hiciste vos, paso a paso?" },
  { id: "result", label: "R · Resultado", hint: "¿Qué cambió? ¿Qué aprendiste?" },
];

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

          {role && seniority && (
            <section className={styles.results} aria-live="polite">
              <div className={styles.printBrand}>
                <img src="/branding/logo-consultora.png" alt="" />
                <div><strong>CR Gestión con Resultados</strong><span>Tu Match Profesional · Preparación de entrevista</span></div>
              </div>
              <div className={`${styles.card} ${styles.noPrint}`}>
                <div className="eyebrow">FOCO PARA {seniority.name.toLocaleUpperCase("es-AR")}</div>
                <p>{seniority.focus}</p>
              </div>
              <div className={styles.noPrint}>
                <button className={styles.button} type="button" onClick={() => window.print()}>Imprimir / Guardar PDF</button>
                <p className={styles.resultIntro}>En el diálogo de impresión elegí “Guardar como PDF”. Tus respuestas quedan en este navegador y no se envían ni guardan en un servidor.</p>
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
                      return (
                        <div className={styles.starField} key={field.id}>
                          <label htmlFor={id}>{field.label} · {field.hint}</label>
                          <textarea id={id} rows={3} value={answers[`${role.id}-${questionIndex}`]?.[field.id] ?? ""} onChange={(event) => updateAnswer(questionIndex, field.id, event.target.value)} />
                        </div>
                      );
                    })}
                  </div>
                </article>
              ))}
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
