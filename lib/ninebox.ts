// ⚠️ PROPUESTA NUEVA — NO ES EL INSTRUMENTO ORIGINAL DE CR GESTIÓN.
//
// Las preguntas, puntajes, umbrales y descripciones originales del Nine Box NO se encontraron en el repositorio
// ni en su historial de Git. Lo único respaldado por documentación es la ESTRUCTURA de diseño:
//   · 6 criterios por eje, escala Likert 1–5.
//   · El eje de potencial se organiza en Habilidad / Aspiración / Compromiso.
// TODO lo demás (redacción de las preguntas, criterios del eje de desempeño, umbrales, textos y sugerencias)
// es una propuesta nueva escrita para esta versión de trabajo y debe ser validada o reemplazada.
// No se usan los nombres propios de los nueve cuadrantes (no fueron recuperados): se describen por posición.

export type Axis = "desempeno" | "potencial";
export type Level = "bajo" | "medio" | "alto";
export type Dimension = "Habilidad" | "Aspiración" | "Compromiso";
export type Answers = Record<string, number>;

export type Criterion = { id: string; axis: Axis; dimension?: Dimension; text: string };

export const CRITERIA: Criterion[] = [
  // Eje de desempeño (propuesta nueva)
  { id: "d1", axis: "desempeno", text: "Cumplo de forma consistente los objetivos y las metas de mi puesto." },
  { id: "d2", axis: "desempeno", text: "Mi trabajo se entrega con la calidad esperada y requiere pocas correcciones." },
  { id: "d3", axis: "desempeno", text: "Cumplo los plazos acordados y mantengo un ritmo de trabajo estable." },
  { id: "d4", axis: "desempeno", text: "Domino los conocimientos y los procedimientos que mi puesto requiere." },
  { id: "d5", axis: "desempeno", text: "Colaboro con mi equipo y con otras áreas para lograr resultados compartidos." },
  { id: "d6", axis: "desempeno", text: "Cumplo las normas y los compromisos de mi puesto sin necesidad de seguimiento." },
  // Eje de potencial: Habilidad, Aspiración y Compromiso, 2 criterios cada una (redacción nueva)
  { id: "p1", axis: "potencial", dimension: "Habilidad", text: "Aprendo con rapidez tareas, herramientas o métodos nuevos." },
  { id: "p2", axis: "potencial", dimension: "Habilidad", text: "Resuelvo situaciones nuevas o complejas que van más allá de mi rutina." },
  { id: "p3", axis: "potencial", dimension: "Aspiración", text: "Quiero asumir mayores responsabilidades en los próximos años." },
  { id: "p4", axis: "potencial", dimension: "Aspiración", text: "Busco activamente oportunidades de desarrollo, proyectos o formación." },
  { id: "p5", axis: "potencial", dimension: "Compromiso", text: "Me siento comprometido/a con los objetivos de la organización y doy un esfuerzo extra cuando hace falta." },
  { id: "p6", axis: "potencial", dimension: "Compromiso", text: "Mantengo la motivación y la energía para mi trabajo aun en períodos de alta exigencia." },
];

export const SCALE = [
  { value: 1, label: "Totalmente en desacuerdo" },
  { value: 2, label: "En desacuerdo" },
  { value: 3, label: "Ni de acuerdo ni en desacuerdo" },
  { value: 4, label: "De acuerdo" },
  { value: 5, label: "Totalmente de acuerdo" },
] as const;

export const AXIS_LABEL: Record<Axis, string> = { desempeno: "Desempeño", potencial: "Potencial" };
export const LEVELS: Level[] = ["bajo", "medio", "alto"];
export const LEVEL_LABEL: Record<Level, string> = { bajo: "Bajo", medio: "Medio", alto: "Alto" };

export const ITEMS_PER_AXIS = 6;
// Umbrales propuestos: tercios iguales de la escala 1–5 aplicados a la suma de los 6 criterios (6–30).
//   Bajo: 6–14 (promedio ≤ 2,33) · Medio: 15–22 (promedio ≤ 3,67) · Alto: 23–30.
export const MAX_SUM_LOW = 14;
export const MAX_SUM_MEDIUM = 22;
export const THRESHOLD_TEXT = "Bajo: suma de 6 a 14 · Medio: 15 a 22 · Alto: 23 a 30 (tercios iguales de la escala 1–5).";

export function levelFromSum(sum: number): Level {
  if (sum <= MAX_SUM_LOW) return "bajo";
  if (sum <= MAX_SUM_MEDIUM) return "medio";
  return "alto";
}

const PERFORMANCE_PHRASE: Record<Level, string> = {
  bajo: "tu autoevaluación indica que hoy cumplís solo parcialmente lo esperado en tu puesto",
  medio: "tu autoevaluación indica que cumplís lo esperado de forma razonable, con margen de mejora",
  alto: "tu autoevaluación indica que cumplís de forma consistente, o superás, lo esperado en tu puesto",
};
const POTENTIAL_PHRASE: Record<Level, string> = {
  bajo: "ves hoy poco margen o interés para crecer hacia responsabilidades mayores",
  medio: "ves una capacidad y un interés moderados para crecer hacia responsabilidades mayores",
  alto: "ves una alta capacidad, interés y compromiso para crecer hacia responsabilidades mayores",
};

const PERFORMANCE_SUGGESTIONS: Record<Level, string[]> = {
  bajo: [
    "Acordá con tu jefatura metas claras y medibles para el próximo trimestre.",
    "Identificá qué conocimientos o recursos te faltan y pedí capacitación o acompañamiento puntual.",
    "Pedí feedback frecuente para corregir desvíos a tiempo.",
  ],
  medio: [
    "Elegí uno o dos criterios con menor puntaje y definí una acción concreta de mejora para cada uno.",
    "Pedí a tu jefatura ejemplos concretos de qué significaría superar lo esperado en tu puesto.",
    "Registrá tus resultados mensuales para detectar en qué área estás más cerca de destacar.",
  ],
  alto: [
    "Documentá tus resultados con evidencias concretas (indicadores, hitos, reconocimientos).",
    "Compartí tu forma de trabajar: ofrecé mentoría o capacitación a compañeros.",
    "Conversá con tu jefatura sobre desafíos de mayor alcance.",
  ],
};
const POTENTIAL_SUGGESTIONS: Record<Level, string[]> = {
  bajo: [
    "Explorá qué tareas de tu rol actual te dan más energía y cuáles menos.",
    "Probá asumir una tarea nueva y acotada para evaluar tu interés y tu facilidad de aprendizaje.",
    "Conversá con tu jefatura sobre expectativas de desarrollo realistas a corto plazo.",
  ],
  medio: [
    "Sumá un proyecto transversal o un rol de apoyo para ampliar tu alcance.",
    "Definí con tu jefatura un plan de desarrollo con dos o tres objetivos de aprendizaje.",
    "Buscá feedback sobre tus fortalezas para decidir en qué dirección crecer.",
  ],
  alto: [
    "Pedí asignaciones desafiantes: proyectos nuevos, reemplazos temporales o coordinación de equipos.",
    "Buscá una persona de un nivel superior que pueda acompañarte como mentor/a.",
    "Armá con tu jefatura un plan de desarrollo con plazos y responsables.",
  ],
};

export type AxisResult = { sum: number; mean: number; level: Level; focus: Criterion[] };
export type NineBoxResult = {
  desempeno: AxisResult;
  potencial: AxisResult;
  column: 0 | 1 | 2; // 0 = desempeño bajo … 2 = desempeño alto
  row: 0 | 1 | 2;    // 0 = fila superior (potencial alto) … 2 = fila inferior (potencial bajo)
  explanation: string;
  suggestions: string[];
};

export function isComplete(answers: Answers): boolean {
  return CRITERIA.every((c) => Number.isInteger(answers[c.id]) && answers[c.id] >= 1 && answers[c.id] <= 5);
}

function axisResult(answers: Answers, axis: Axis): AxisResult {
  const items = CRITERIA.filter((c) => c.axis === axis);
  const sum = items.reduce((total, c) => total + answers[c.id], 0);
  // Criterios con menor puntaje: solo los que quedaron en 3 o menos, los 3 más bajos.
  const focus = items.filter((c) => answers[c.id] <= 3).sort((a, b) => answers[a.id] - answers[b.id]).slice(0, 3);
  return { sum, mean: Math.round((sum / items.length) * 10) / 10, level: levelFromSum(sum), focus };
}

export function evaluate(answers: Answers): NineBoxResult | null {
  if (!isComplete(answers)) return null;
  const desempeno = axisResult(answers, "desempeno");
  const potencial = axisResult(answers, "potencial");
  const column = LEVELS.indexOf(desempeno.level) as 0 | 1 | 2;
  const row = (2 - LEVELS.indexOf(potencial.level)) as 0 | 1 | 2;
  return {
    desempeno, potencial, column, row,
    explanation: `Desempeño ${LEVEL_LABEL[desempeno.level].toLowerCase()}: ${PERFORMANCE_PHRASE[desempeno.level]}. Potencial ${LEVEL_LABEL[potencial.level].toLowerCase()}: ${POTENTIAL_PHRASE[potencial.level]}.`,
    suggestions: [...PERFORMANCE_SUGGESTIONS[desempeno.level].slice(0, 2), ...POTENTIAL_SUGGESTIONS[potencial.level].slice(0, 2)],
  };
}
