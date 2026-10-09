import type { Metadata } from "next";
import { CommercialCta, CommercialFooter, CommercialHeader } from "../components/CommercialTools";
import styles from "../commercialTools.module.css";

export const metadata: Metadata = {
  title: "Recursos de empleabilidad | Tu Match Profesional",
  description: "Guías breves para adaptar tu CV, presentarte, preparar entrevistas, negociar y explicar períodos sin empleo.",
};

const guides = [
  {
    id: "adaptar-cv",
    title: "Adaptar el CV a una búsqueda",
    copy: "Leé el aviso completo e identificá tareas, requisitos y palabras clave. Priorizá experiencias reales que respondan a esos puntos y describí tu aporte con acciones y resultados verificables. No agregues conocimientos ni funciones que no tenés; adaptá el énfasis, no los hechos.",
    href: "/#job-description",
    link: "Analizar tu CV con una oportunidad",
  },
  {
    id: "contame-sobre-vos",
    title: "Responder “contame sobre vos”",
    copy: "Prepará una presentación breve: tu perfil actual, dos experiencias o fortalezas relevantes para el puesto y qué te interesa aportar. Usá ejemplos concretos, mantené el foco laboral y practicá para poder decirlo con naturalidad, no de memoria.",
    href: "/preparar-entrevista",
    link: "Practicar respuestas de entrevista",
  },
  {
    id: "preparar-entrevista",
    title: "Preparar una entrevista",
    copy: "Revisá las tareas del puesto, elegí ejemplos propios y ordenalos con STAR: Situación, Tarea, Acción y Resultado. Separá con claridad qué hizo el equipo y cuál fue tu aporte. Prepará preguntas para hacer y verificá logística o conexión antes del encuentro.",
    href: "/preparar-entrevista",
    link: "Abrir la práctica STAR",
  },
  {
    id: "negociar-salario",
    title: "Conversar sobre salario",
    copy: "Antes de responder, definí qué remuneración buscás, cuál es tu piso personal y qué condiciones necesitás aclarar. Confirmá si los importes son netos o brutos, su período y qué componentes incluye la propuesta. Compará esos datos con tus prioridades, sin basarte en cifras que no verificaste.",
    href: "/salario",
    link: "Calcular tu objetivo y comparar una oferta",
  },
  {
    id: "periodos-sin-empleo",
    title: "Explicar períodos sin empleo",
    copy: "Respondé con honestidad y brevedad: describí el período sin compartir más información personal de la que quieras, mencioná actividades relevantes si las hubo y conectá con tu disponibilidad o interés actual. No necesitás inventar una explicación ni justificar decisiones privadas.",
    href: "/preparar-entrevista",
    link: "Ensayar una respuesta con STAR",
  },
];

export default function ResourcesPage() {
  return (
    <>
      <CommercialHeader current="/recursos" />
      <main className={styles.page}>
        <section className={`shell ${styles.hero}`}>
          <div className="eyebrow">TU MATCH PROFESIONAL · RECURSOS GRATUITOS</div>
          <h1>Ideas prácticas para avanzar en tu búsqueda laboral.</h1>
          <p>Guías breves para trabajar tu postulación con información propia y decisiones conscientes. Tu Match Profesional es una iniciativa de CR Gestión con Resultados.</p>
        </section>
        <div className={`shell ${styles.content}`}>
          <section className={styles.guideGrid} aria-label="Guías de empleabilidad">
            {guides.map((guide) => (
              <article className={styles.guideCard} id={guide.id} key={guide.id}>
                <h2>{guide.title}</h2>
                <p>{guide.copy}</p>
                <a href={guide.href}>{guide.link} →</a>
              </article>
            ))}
          </section>
          <CommercialCta />
        </div>
      </main>
      <CommercialFooter />
    </>
  );
}
