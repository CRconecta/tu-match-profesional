export type CompetencyId =
  | "seguridad" | "equipo" | "problemas" | "adaptabilidad" | "organizacion" | "resultados"
  | "comunicacion" | "detalle" | "cliente" | "dificiles" | "comercial" | "negociacion"
  | "liderazgo" | "personas" | "decisiones" | "analisis" | "confidencialidad";

export type Competency = {
  id: CompetencyId;
  name: string;
  focus: string;
  questions: [string, string];
  followUps: [string, string, string];
  evidence: string[];
  redFlags: string[];
};

export const COMPETENCIES: Record<CompetencyId, Competency> = {
  seguridad: {
    id: "seguridad", name: "Seguridad y cumplimiento",
    focus: "Respeta normas, procedimientos y elementos de protección, y actúa para prevenir riesgos propios y ajenos.",
    questions: [
      "Contame una situación en la que detectaste un riesgo de seguridad en tu puesto. ¿Qué hiciste?",
      "Contame una vez en que cumplir un procedimiento te demandaba más tiempo o esfuerzo y había presión por terminar. ¿Cómo actuaste?",
    ],
    followUps: [
      "¿Qué norma o procedimiento aplicaba en ese momento y cómo lo conocías?",
      "¿A quién avisaste y qué pasó después de tu aviso?",
      "¿Qué cambió en tu forma de trabajar a partir de esa experiencia?",
    ],
    evidence: ["Describe hechos concretos (qué riesgo, dónde, cuándo)", "Menciona normas, EPP o procedimientos específicos", "Reportó o corrigió el riesgo y hay un resultado verificable"],
    redFlags: ["Minimiza los incumplimientos o los atribuye a otros", "Prioriza velocidad sobre seguridad sin cuestionarlo", "No logra dar un ejemplo concreto"],
  },
  equipo: {
    id: "equipo", name: "Trabajo en equipo",
    focus: "Colabora con otros para lograr un objetivo común, comparte información y asume su parte.",
    questions: [
      "Contame una situación en la que tuviste que coordinar tu trabajo con compañeros para cumplir un objetivo en común.",
      "Contame de una vez en que hubo un desacuerdo o tensión con un compañero. ¿Cómo lo manejaste?",
    ],
    followUps: [
      "¿Cuál era específicamente tu parte y cuál la de los demás?",
      "¿Qué hiciste cuando alguien no estaba cumpliendo con su parte?",
      "¿Cómo terminó la situación y qué resultado tuvo el equipo?",
    ],
    evidence: ["Distingue su aporte individual del colectivo", "Da ejemplos de ayuda o información compartida", "Resuelve diferencias con hechos y un resultado concreto"],
    redFlags: ["Habla siempre en singular y no menciona al equipo", "Culpa a otros por los problemas", "Evita el conflicto sin resolverlo"],
  },
  problemas: {
    id: "problemas", name: "Resolución de problemas",
    focus: "Identifica la causa de un inconveniente, evalúa alternativas y aplica una solución efectiva.",
    questions: [
      "Contame de un problema inesperado que tuviste en tu trabajo. ¿Qué hiciste para resolverlo?",
      "Contame de una vez en que una solución que aplicaste no funcionó. ¿Qué hiciste después?",
    ],
    followUps: [
      "¿Cómo te diste cuenta de cuál era la causa del problema?",
      "¿Qué alternativas consideraste y por qué elegiste esa?",
      "¿Qué hiciste para que no volviera a ocurrir?",
    ],
    evidence: ["Describe la causa y no solo el síntoma", "Muestra alternativas evaluadas", "Resultado medible o verificable"],
    redFlags: ["Espera siempre que otro resuelva", "Soluciones sin explicar el porqué", "No aprende del error"],
  },
  adaptabilidad: {
    id: "adaptabilidad", name: "Adaptabilidad",
    focus: "Se ajusta a cambios de tareas, turnos, prioridades o métodos manteniendo el desempeño.",
    questions: [
      "Contame de un cambio importante en tu trabajo (tareas, turno, método, jefe). ¿Cómo lo afrontaste?",
      "Contame de una vez en que tuviste que aprender algo nuevo rápidamente para cumplir con tu tarea.",
    ],
    followUps: [
      "¿Qué fue lo más difícil del cambio y cómo lo manejaste?",
      "¿Qué hiciste concretamente para aprender o adaptarte?",
      "¿Cómo se vio reflejado en tu desempeño después de un tiempo?",
    ],
    evidence: ["Acciones concretas para adaptarse", "Tiempo y resultado de la adaptación", "Actitud proactiva frente al cambio"],
    redFlags: ["Rechazo sistemático a los cambios", "Se centra solo en lo negativo del cambio", "No puede dar ejemplos"],
  },
  organizacion: {
    id: "organizacion", name: "Organización",
    focus: "Planifica y prioriza tareas, ordena su espacio y sus tiempos para cumplir con lo asignado.",
    questions: [
      "Contame de una semana con muchas tareas simultáneas. ¿Cómo las organizaste?",
      "Contame de una vez en que se te acumuló trabajo o se complicó un plazo. ¿Qué hiciste?",
    ],
    followUps: [
      "¿Qué criterio usaste para decidir qué hacer primero?",
      "¿Qué herramienta o método usás para no olvidar tareas?",
      "¿Qué quedó sin hacer y cómo lo comunicaste?",
    ],
    evidence: ["Criterios claros de priorización", "Método o herramienta concreta", "Cumplimiento de plazos con ejemplos"],
    redFlags: ["Trabaja \"sobre la marcha\" sin método", "Olvidos frecuentes sin acciones correctivas", "No comunica los retrasos"],
  },
  resultados: {
    id: "resultados", name: "Orientación a resultados",
    focus: "Se compromete con metas y objetivos, hace seguimiento y busca cumplirlos con calidad.",
    questions: [
      "Contame de un objetivo o meta que tuviste que cumplir. ¿Qué hiciste para lograrlo?",
      "Contame de una vez en que no llegabas a la meta. ¿Qué acciones tomaste?",
    ],
    followUps: [
      "¿Cómo medías tu avance?",
      "¿Cuál fue el resultado final, con números si es posible?",
      "¿Qué harías distinto hoy?",
    ],
    evidence: ["Metas concretas y medibles", "Acciones propias vinculadas al resultado", "Seguimiento del avance"],
    redFlags: ["Habla de tareas, no de resultados", "No recuerda metas ni indicadores", "Atribuye el resultado solo a factores externos"],
  },
  comunicacion: {
    id: "comunicacion", name: "Comunicación",
    focus: "Transmite información con claridad, escucha activamente y adapta su mensaje a la persona.",
    questions: [
      "Contame de una vez en que tuviste que explicar algo complejo a alguien que no lo entendía.",
      "Contame de una situación en la que un error de comunicación generó un problema. ¿Qué hiciste?",
    ],
    followUps: [
      "¿Cómo te diste cuenta de que no te estaban entendiendo?",
      "¿Qué cambiaste en tu forma de comunicar?",
      "¿Cómo confirmaste que el mensaje había quedado claro?",
    ],
    evidence: ["Adapta el mensaje al interlocutor", "Verifica comprensión", "Ejemplos de escucha activa"],
    redFlags: ["Respuestas confusas o desorganizadas", "Interrumpe o no escucha la pregunta", "Culpa al otro por no entender"],
  },
  detalle: {
    id: "detalle", name: "Atención al detalle",
    focus: "Trabaja con precisión, detecta errores y verifica antes de entregar o cerrar una tarea.",
    questions: [
      "Contame de una vez en que detectaste un error que los demás no habían visto. ¿Cómo lo hiciste?",
      "Contame de una tarea en la que un error pequeño podía tener consecuencias importantes. ¿Cómo la controlaste?",
    ],
    followUps: [
      "¿Qué método usás para revisar tu trabajo?",
      "¿Qué consecuencias habría tenido el error?",
      "¿Qué hiciste para evitar que se repitiera?",
    ],
    evidence: ["Método propio de control", "Errores concretos detectados y corregidos", "Conciencia de las consecuencias"],
    redFlags: ["Dice \"soy detallista\" sin ejemplos", "Errores recurrentes no reconocidos", "No verifica su trabajo"],
  },
  cliente: {
    id: "cliente", name: "Orientación al cliente",
    focus: "Entiende y prioriza las necesidades del cliente (interno o externo) y busca brindar un buen servicio.",
    questions: [
      "Contame de una vez en que fuiste más allá de lo habitual para resolverle algo a un cliente.",
      "Contame de un cliente con una necesidad que no podías cubrir de inmediato. ¿Qué hiciste?",
    ],
    followUps: [
      "¿Cómo te diste cuenta de lo que realmente necesitaba?",
      "¿Qué dijiste y qué hiciste concretamente?",
      "¿Cómo reaccionó el cliente y qué resultado tuvo?",
    ],
    evidence: ["Identifica la necesidad real del cliente", "Acciones concretas de seguimiento", "Resultado: cliente satisfecho o problema resuelto"],
    redFlags: ["Ve al cliente como una molestia", "Respuestas genéricas sobre \"atender bien\"", "Culpa al cliente"],
  },
  dificiles: {
    id: "dificiles", name: "Manejo de situaciones difíciles",
    focus: "Mantiene el control emocional y actúa con criterio ante reclamos, tensión o presión.",
    questions: [
      "Contame de una situación con una persona enojada o un reclamo difícil. ¿Qué hiciste?",
      "Contame de un momento de mucha presión en el trabajo. ¿Cómo lo manejaste?",
    ],
    followUps: [
      "¿Qué dijiste y qué hiciste en los primeros minutos?",
      "¿Qué hiciste para mantener la calma?",
      "¿Cómo terminó la situación y qué aprendiste?",
    ],
    evidence: ["Describe acciones y palabras concretas", "Autocontrol y escucha ante el conflicto", "Resolución o escalamiento adecuado"],
    redFlags: ["Responde con enojo o confrontación", "Evita el problema o lo deriva siempre", "Dice \"nunca tuve problemas\" sin ejemplos"],
  },
  comercial: {
    id: "comercial", name: "Orientación comercial",
    focus: "Detecta oportunidades de venta, entiende al cliente y propone soluciones que generan negocio.",
    questions: [
      "Contame de una venta o negocio que lograste cerrar. ¿Cómo fue el proceso?",
      "Contame de una oportunidad comercial que detectaste por iniciativa propia.",
    ],
    followUps: [
      "¿Cómo identificaste lo que el cliente necesitaba?",
      "¿Qué objeciones aparecieron y cómo las respondiste?",
      "¿Qué números o resultados obtuviste?",
    ],
    evidence: ["Resultados comerciales con cifras", "Proceso de venta descrito paso a paso", "Iniciativa para generar oportunidades"],
    redFlags: ["Sin cifras ni resultados verificables", "Enfoque solo en presionar, sin escuchar", "Atribuye los fracasos solo al mercado"],
  },
  negociacion: {
    id: "negociacion", name: "Negociación",
    focus: "Busca acuerdos beneficiosos para ambas partes, maneja objeciones y sostiene sus límites.",
    questions: [
      "Contame de una negociación difícil que tuviste (precio, plazos, condiciones). ¿Cómo la llevaste?",
      "Contame de una vez en que tuviste que decir que no a un cliente o a un compañero sin perder la relación.",
    ],
    followUps: [
      "¿Qué objetivo tenías y cuál era tu límite?",
      "¿Qué cedieron cada una de las partes?",
      "¿Cómo quedó la relación después del acuerdo?",
    ],
    evidence: ["Objetivos y límites definidos antes de negociar", "Acuerdos concretos logrados", "Cuida la relación a largo plazo"],
    redFlags: ["Cede todo para cerrar rápido", "Enfoque ganar-perder", "No puede describir cómo negoció"],
  },
  liderazgo: {
    id: "liderazgo", name: "Liderazgo",
    focus: "Orienta e inspira a otros hacia un objetivo, da dirección clara y asume la responsabilidad.",
    questions: [
      "Contame de una vez en que tuviste que guiar a un grupo para cumplir un objetivo difícil.",
      "Contame de una situación en que tuviste que motivar a alguien con bajo rendimiento o poca energía.",
    ],
    followUps: [
      "¿Cómo comunicaste el objetivo y las expectativas?",
      "¿Qué hiciste cuando alguien no seguía la dirección?",
      "¿Qué resultado obtuvo el equipo y cuál fue tu aporte?",
    ],
    evidence: ["Dirección clara y expectativas comunicadas", "Acciones concretas para motivar y acompañar", "Asume responsabilidad por los resultados"],
    redFlags: ["Liderar es \"dar órdenes\"", "Se atribuye todo el mérito", "Evita las conversaciones difíciles"],
  },
  personas: {
    id: "personas", name: "Gestión de personas",
    focus: "Asigna tareas, da feedback, desarrolla al equipo y gestiona desempeño y conflictos.",
    questions: [
      "Contame de una vez en que diste feedback difícil a un colaborador. ¿Cómo lo hiciste?",
      "Contame de una situación en la que tuviste que resolver un conflicto dentro de tu equipo.",
    ],
    followUps: [
      "¿Qué hechos concretos usaste para dar el feedback?",
      "¿Qué acuerdos quedaron y cómo hiciste seguimiento?",
      "¿Qué cambió en el desempeño de esa persona o del equipo?",
    ],
    evidence: ["Feedback basado en hechos y no en opiniones", "Seguimiento posterior", "Desarrollo y delegación efectiva"],
    redFlags: ["Evita el feedback o lo da tarde", "Decisiones basadas en simpatías", "No distingue desempeño de actitud"],
  },
  decisiones: {
    id: "decisiones", name: "Toma de decisiones",
    focus: "Analiza la información disponible, evalúa riesgos y decide a tiempo asumiendo las consecuencias.",
    questions: [
      "Contame de una decisión difícil que tuviste que tomar con poca información o poco tiempo.",
      "Contame de una decisión que resultó ser un error. ¿Qué hiciste?",
    ],
    followUps: [
      "¿Qué información y qué opciones tuviste en cuenta?",
      "¿Qué riesgos evaluaste y por qué elegiste esa opción?",
      "¿Qué resultado tuvo y qué cambiarías hoy?",
    ],
    evidence: ["Criterios de decisión explícitos", "Opciones y riesgos evaluados", "Asume la responsabilidad por el resultado"],
    redFlags: ["Posterga o delega siempre las decisiones", "Decide sin analizar", "Culpa a otros por decisiones propias"],
  },
  analisis: {
    id: "analisis", name: "Análisis y resolución de problemas",
    focus: "Organiza datos, detecta patrones o desvíos y propone soluciones sustentadas en información.",
    questions: [
      "Contame de una vez en que analizaste datos o información para entender un desvío o error.",
      "Contame de un proceso o tarea que mejoraste a partir de un análisis propio.",
    ],
    followUps: [
      "¿Qué datos usaste y cómo los organizaste?",
      "¿Qué conclusión sacaste y cómo la validaste?",
      "¿Qué mejora concreta se implementó y con qué resultado?",
    ],
    evidence: ["Usa datos concretos para sustentar conclusiones", "Método de análisis descrito", "Mejora implementada y medida"],
    redFlags: ["Conclusiones basadas en intuición", "No sabe explicar cómo llegó a su conclusión", "Propone soluciones sin diagnóstico"],
  },
  confidencialidad: {
    id: "confidencialidad", name: "Confidencialidad",
    focus: "Resguarda información sensible, respeta los límites de acceso y actúa con discreción y ética.",
    questions: [
      "Contame de una vez en que manejaste información sensible o confidencial en tu trabajo. ¿Cómo la resguardaste?",
      "Contame de una situación en la que alguien te pidió información que no correspondía compartir. ¿Qué hiciste?",
    ],
    followUps: [
      "¿Qué medidas concretas tomaste para proteger la información?",
      "¿Qué le dijiste a la persona que te la pedía?",
      "¿Alguna vez cometiste un error con información sensible? ¿Qué hiciste?",
    ],
    evidence: ["Ejemplos concretos de discreción", "Conoce políticas y límites de acceso", "Puede decir que no sin dañar la relación"],
    redFlags: ["Comenta casos de empleadores anteriores con detalles identificables", "No distingue qué es confidencial", "Minimiza la importancia de la reserva"],
  },
};

export const COMPETENCY_ORDER: CompetencyId[] = [
  "seguridad", "equipo", "problemas", "adaptabilidad", "organizacion", "resultados", "comunicacion", "detalle",
  "cliente", "dificiles", "comercial", "negociacion", "liderazgo", "personas", "decisiones", "analisis", "confidencialidad",
];

export type Position = { id: string; name: string; competencies: CompetencyId[] };

export const POSITIONS: Position[] = [
  { id: "operario-produccion", name: "Operario/a de Producción", competencies: ["seguridad", "equipo", "problemas", "adaptabilidad"] },
  { id: "operario-deposito", name: "Operario/a de Depósito", competencies: ["seguridad", "organizacion", "equipo", "problemas"] },
  { id: "repositor", name: "Repositor/a", competencies: ["cliente", "organizacion", "equipo", "resultados"] },
  { id: "cajero", name: "Cajero/a", competencies: ["cliente", "detalle", "dificiles", "resultados"] },
  { id: "atencion-cliente", name: "Atención al Cliente", competencies: ["comunicacion", "cliente", "dificiles", "problemas"] },
  { id: "administrativo", name: "Administrativo/a", competencies: ["organizacion", "detalle", "comunicacion", "resultados"] },
  { id: "administrativo-rrhh", name: "Administrativo/a de RRHH", competencies: ["organizacion", "comunicacion", "detalle", "confidencialidad"] },
  { id: "analista-administrativo", name: "Analista Administrativo/a", competencies: ["analisis", "organizacion", "detalle", "resultados"] },
  { id: "recepcionista", name: "Recepcionista", competencies: ["comunicacion", "cliente", "organizacion", "dificiles"] },
  { id: "vendedor", name: "Vendedor/a", competencies: ["comercial", "comunicacion", "resultados", "negociacion"] },
  { id: "ejecutivo-comercial", name: "Ejecutivo/a Comercial", competencies: ["comercial", "negociacion", "resultados", "comunicacion"] },
  { id: "supervisor-produccion", name: "Supervisor/a de Producción", competencies: ["liderazgo", "seguridad", "personas", "decisiones"] },
  { id: "otro", name: "Otro puesto", competencies: [] },
];

export const LEVELS = [
  { id: "operativo", name: "Operativo", focus: "Indagar sobre tareas propias, cumplimiento de procedimientos y trabajo cotidiano. El alcance de los ejemplos es individual o de un equipo cercano." },
  { id: "analista", name: "Analista", focus: "Indagar sobre autonomía, análisis, calidad del trabajo y mejora de procesos. Buscar ejemplos donde haya tomado iniciativa." },
  { id: "supervisor", name: "Supervisor/a", focus: "Indagar sobre coordinación de personas y tareas, feedback, cumplimiento de objetivos del equipo y gestión de desvíos." },
  { id: "jefatura", name: "Jefatura", focus: "Indagar sobre gestión de áreas, priorización, desarrollo de personas y resultados medibles. Buscar impacto más allá de su propia tarea." },
  { id: "gerencia", name: "Gerencia", focus: "Indagar sobre decisiones de alto impacto, visión de negocio, gestión de líderes y resultados estratégicos. Pedir contexto, riesgos y consecuencias." },
] as const;

export type LevelId = (typeof LEVELS)[number]["id"];

export const SCORE_LABELS: Record<number, string> = {
  1: "Sin evidencia",
  2: "Evidencia débil",
  3: "Evidencia suficiente",
  4: "Evidencia sólida",
  5: "Evidencia sobresaliente",
};

export const DECISIONS = ["Avanza", "Avanza con reservas", "No avanza"] as const;
export type Decision = (typeof DECISIONS)[number];
