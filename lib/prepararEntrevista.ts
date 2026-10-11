type Prompt = {
  question: string;
  competency: string;
  evidence: string;
  followUps: [string, string];
};

type Role = {
  id: string;
  name: string;
  questions: [Prompt, Prompt, Prompt, Prompt, Prompt, Prompt];
};

const prompt = (question: string, competency: string, evidence: string, firstFollowUp: string, secondFollowUp: string): Prompt => ({
  question,
  competency,
  evidence,
  followUps: [firstFollowUp, secondFollowUp],
});

export const INTERVIEW_ROLES: Role[] = [
  {
    id: "operario-produccion",
    name: "Operario/a de producción",
    questions: [
      prompt("Contame una situación en la que tuviste que seguir un procedimiento de producción aunque hubiera presión por terminar.", "Cumplimiento de procedimientos", "Qué pasos siguió y cómo equilibró ritmo y cumplimiento.", "¿Qué parte del procedimiento era clave?", "¿Cómo terminó el turno o la tarea?"),
      prompt("Describí una vez que detectaste un defecto o una diferencia en un producto durante tu trabajo.", "Atención a la calidad", "Cómo identificó, comunicó y trató la diferencia según el proceso.", "¿Qué señales te hicieron notarlo?", "¿Qué ocurrió después de avisar?"),
      prompt("Contame de una ocasión en la que tuviste que coordinarte con otras personas para completar una producción.", "Trabajo en equipo", "Su aporte concreto y cómo se organizó con el equipo.", "¿Qué tarea dependía de otra persona?", "¿Cómo verificaron que el trabajo estuviera completo?"),
      prompt("¿Qué hiciste ante una falla o una detención inesperada de una máquina o proceso?", "Resolución de problemas", "Acciones seguras, comunicación y seguimiento del incidente.", "¿Qué verificaste antes de actuar?", "¿A quién informaste y qué pasó luego?"),
      prompt("Contame una situación en la que tuviste que aprender una tarea o un equipo nuevo.", "Aprendizaje y adaptación", "Cómo buscó instrucciones, practicó y comprobó que podía realizar la tarea.", "¿Qué te resultó más difícil?", "¿Cómo supiste que ya podías hacerlo correctamente?"),
      prompt("Describí una jornada en la que tuviste varias prioridades o cambios de ritmo.", "Organización del trabajo", "Cómo ordenó tareas y comunicó demoras o necesidades.", "¿Qué criterio usaste para priorizar?", "¿Qué resultado obtuviste al cierre?"),
    ],
  },
  {
    id: "deposito",
    name: "Depósito",
    questions: [
      prompt("Contame de una recepción de mercadería en la que encontraste una diferencia entre lo recibido y lo esperado.", "Control de mercadería", "Cómo comparó la información, registró la diferencia y la comunicó.", "¿Qué datos revisaste?", "¿Cómo se resolvió la diferencia?"),
      prompt("Describí cómo organizaste una jornada con pedidos urgentes y tareas de almacenamiento pendientes.", "Priorización", "Criterios claros para ordenar pedidos sin perder control de las tareas.", "¿Qué información consideraste?", "¿Cómo comunicaste las prioridades al equipo?"),
      prompt("Contame una ocasión en la que tuviste que ubicar o preparar un artículo con información incompleta.", "Búsqueda y precisión", "Verificaciones realizadas antes de mover o despachar el artículo.", "¿Qué fuentes consultaste?", "¿Cómo confirmaste que era el artículo correcto?"),
      prompt("¿Qué hiciste cuando advertiste una condición insegura o un obstáculo en una zona de circulación?", "Seguridad en el depósito", "Cómo evitó exponer a otras personas y a quién informó.", "¿Qué riesgo identificaste?", "¿Qué medida se tomó después?"),
      prompt("Describí un error de inventario o preparación que hayas detectado o ayudado a corregir.", "Control de inventario", "Cómo rastreó la causa y dejó registro o comunicó la corrección.", "¿Cómo localizaste el origen?", "¿Qué aprendiste para prevenir que se repitiera?"),
      prompt("Contame de una vez que tuviste que coordinarte con transporte, compras u otra área.", "Coordinación", "Información que compartió y seguimiento hasta completar la tarea.", "¿Qué necesitaba saber la otra área?", "¿Cómo verificaste el resultado?"),
    ],
  },
  {
    id: "administrativo",
    name: "Administrativo/a",
    questions: [
      prompt("Contame cómo organizaste un período con vencimientos y pedidos de distintas personas al mismo tiempo.", "Organización y prioridades", "Método concreto para ordenar fechas, urgencias y avances.", "¿Cómo definiste qué iba primero?", "¿Qué hiciste cuando apareció una nueva urgencia?"),
      prompt("Describí una vez en que detectaste un error en una planilla, carga o documento.", "Atención al detalle", "Cómo verificó el dato, corrigió la información y avisó a quien correspondía.", "¿Cómo encontraste la diferencia?", "¿Qué control agregaste o aplicaste después?"),
      prompt("Contame de una tarea administrativa repetitiva que hayas logrado hacer más clara u ordenada.", "Mejora de procesos", "Cambio concreto y efecto observable en el trabajo.", "¿Qué dificultad querías resolver?", "¿Cómo comprobaste si la mejora servía?"),
      prompt("¿Qué hiciste cuando recibiste instrucciones incompletas para una tarea?", "Comunicación", "Preguntas de aclaración y confirmación de lo acordado.", "¿Qué necesitabas confirmar?", "¿Cómo evitaste avanzar con una suposición?"),
      prompt("Describí una ocasión en la que tuviste que atender a varias áreas o personas con necesidades diferentes.", "Servicio interno", "Cómo escuchó los pedidos, explicó plazos y sostuvo el seguimiento.", "¿Cómo acordaste prioridades?", "¿Qué devolución recibiste?"),
      prompt("Contame cómo cuidaste información de trabajo que no debía circular más allá de quienes la necesitaban.", "Confidencialidad", "Criterios prácticos para limitar el acceso y manejar consultas.", "¿Qué hiciste ante una consulta de alguien no involucrado?", "¿Cómo compartiste solo lo necesario?"),
    ],
  },
  {
    id: "administrativo-rrhh",
    name: "Administrativo/a de RRHH",
    questions: [
      prompt("Contame de una vez en que tuviste que organizar documentación o datos de varias personas con fechas distintas.", "Organización y seguimiento", "Método para ordenar pendientes, vencimientos y estado de cada caso.", "¿Cómo verificaste que no faltara documentación?", "¿Qué hacías para dar seguimiento a lo pendiente?"),
      prompt("Describí cómo manejaste una consulta de una persona que necesitaba una respuesta que aún no tenías.", "Atención y comunicación", "Escucha, claridad sobre los pasos siguientes y seguimiento sin prometer de más.", "¿Qué le explicaste en ese momento?", "¿Cómo retomaste la consulta?"),
      prompt("Contame de una ocasión en la que encontraste información inconsistente en un registro de personal.", "Calidad de datos", "Verificaciones antes de actualizar y comunicación de la diferencia.", "¿Con qué fuente contrastaste el dato?", "¿Cómo quedó documentada la corrección?"),
      prompt("¿Cómo actuaste al recibir información sensible que debía manejarse con cuidado?", "Confidencialidad", "Acciones concretas para resguardar y compartir solo con personas autorizadas.", "¿Cómo definiste quién necesitaba conocerla?", "¿Qué hiciste si alguien pidió más información?"),
      prompt("Describí una etapa con varias tareas administrativas de RRHH y prioridades simultáneas.", "Priorización", "Criterios para ordenar tareas y comunicar tiempos o riesgos de demora.", "¿Qué herramienta o registro usaste?", "¿Qué ajustaste cuando cambió una prioridad?"),
      prompt("Contame de una vez que tuviste que aprender un sistema o procedimiento nuevo relacionado con RRHH.", "Aprendizaje", "Cómo practicó, pidió apoyo y verificó la calidad de su trabajo.", "¿Qué pasos seguiste para aprenderlo?", "¿Cómo comprobaste que aplicabas el proceso correctamente?"),
    ],
  },
  {
    id: "atencion-cliente",
    name: "Atención al cliente",
    questions: [
      prompt("Contame de una conversación con una persona disconforme y cómo la acompañaste.", "Escucha y empatía", "Cómo identificó la necesidad, explicó opciones y acordó un siguiente paso.", "¿Qué necesitaba resolver la persona?", "¿Cómo quedó el caso?"),
      prompt("Describí una consulta que no pudiste resolver en el primer contacto.", "Resolución y seguimiento", "Cómo buscó información o derivó el caso y mantuvo informada a la persona.", "¿Qué le dijiste mientras investigabas?", "¿Cómo verificaste que se resolviera?"),
      prompt("Contame de un momento con varias consultas o tareas de atención al mismo tiempo.", "Organización", "Cómo priorizó sin perder información ni dejar consultas sin seguimiento.", "¿Qué atendiste primero y por qué?", "¿Cómo retomaste lo que quedó pendiente?"),
      prompt("¿Qué hiciste cuando una persona pidió algo que no estaba disponible o no podías confirmar?", "Comunicación responsable", "Cómo explicó límites con claridad y ofreció una alternativa o canal adecuado.", "¿Qué alternativa planteaste?", "¿Qué evitaste prometer?"),
      prompt("Describí una vez en que tuviste que transmitir una información compleja de forma sencilla.", "Comunicación", "Adaptación del lenguaje y confirmación de que el mensaje se entendió.", "¿Cómo adaptaste la explicación?", "¿Qué señales te indicaron que quedó claro?"),
      prompt("Contame cómo organizaste el seguimiento de consultas que requerían más de un contacto.", "Seguimiento", "Registro de compromisos, tiempos y cierre de la consulta.", "¿Cómo evitaste olvidar el próximo paso?", "¿Cómo supiste que la consulta quedó cerrada?"),
    ],
  },
  {
    id: "vendedor",
    name: "Vendedor/a",
    questions: [
      prompt("Contame de una venta en la que primero necesitaste entender bien qué buscaba la persona.", "Detección de necesidades", "Preguntas realizadas y conexión entre necesidad y propuesta.", "¿Qué preguntaste antes de ofrecer?", "¿Cómo confirmaste que la propuesta era pertinente?"),
      prompt("Describí una objeción difícil que hayas recibido y cómo respondiste.", "Manejo de objeciones", "Escucha de la objeción y respuesta basada en información verificable.", "¿Qué había detrás de la objeción?", "¿Cómo terminó la conversación?"),
      prompt("Contame de una oportunidad que no se concretó y qué hiciste después.", "Aprendizaje comercial", "Seguimiento respetuoso y reflexión sobre lo que podía mejorar.", "¿Qué señales observaste durante el proceso?", "¿Qué harías distinto en una situación similar?"),
      prompt("¿Cómo organizaste el seguimiento de varias personas interesadas en distintos momentos?", "Seguimiento comercial", "Uso de registros, acuerdos y próximos pasos claros.", "¿Cómo priorizaste los contactos?", "¿Cómo evitaste insistir de manera inoportuna?"),
      prompt("Describí una ocasión en la que tuviste que explicar con honestidad una limitación de un producto o servicio.", "Venta responsable", "Información clara sin promesas que no pudiera sostener.", "¿Qué alternativa ofreciste?", "¿Cómo reaccionó la persona?"),
      prompt("Contame de una meta comercial exigente y cómo organizaste tus acciones para abordarla.", "Orientación a resultados", "Acciones concretas, seguimiento de avances y ajustes.", "¿Qué indicadores o señales revisabas?", "¿Qué aprendiste del resultado?"),
    ],
  },
  {
    id: "analista-administrativo",
    name: "Analista administrativo/a",
    questions: [
      prompt("Contame de un análisis de información que ayudó a explicar una diferencia o tendencia.", "Análisis de datos", "Fuentes revisadas, criterio de comparación y conclusión sustentada.", "¿Cómo validaste la calidad de los datos?", "¿Qué decisión o pregunta surgió del análisis?"),
      prompt("Describí una vez que tuviste que presentar información técnica o detallada a alguien de otra área.", "Síntesis y comunicación", "Cómo seleccionó los datos relevantes y adaptó el mensaje.", "¿Qué necesitaba decidir esa persona?", "¿Cómo comprobaste que la conclusión quedó clara?"),
      prompt("¿Qué hiciste cuando encontraste datos faltantes o inconsistentes antes de cerrar un reporte?", "Calidad de información", "Verificaciones realizadas y transparencia sobre los límites de los datos.", "¿Qué fuentes consultaste?", "¿Cómo informaste lo que no podía concluirse?"),
      prompt("Contame de un proceso administrativo que hayas revisado para reducir errores o pasos innecesarios.", "Mejora de procesos", "Problema identificado, cambio propuesto y resultado observable.", "¿Cómo mediste la situación inicial?", "¿Qué pasó luego de implementar el cambio?"),
      prompt("Describí cómo resolviste un análisis con un plazo ajustado y otros pedidos en curso.", "Gestión de prioridades", "Alcance acordado, priorización y comunicación de riesgos.", "¿Qué definiste como imprescindible?", "¿Qué acordaste sobre los plazos o entregables?"),
      prompt("Contame de una ocasión en la que tus conclusiones no coincidieron con la expectativa inicial de quien pidió el análisis.", "Criterio profesional", "Uso de evidencia, explicación respetuosa y apertura a revisar datos.", "¿Qué evidencia presentaste?", "¿Cambió algo al revisar el caso en conjunto?"),
    ],
  },
  {
    id: "supervisor-produccion",
    name: "Supervisor/a de producción",
    questions: [
      prompt("Contame de una situación en la que tuviste que ordenar prioridades de producción ante un cambio de plan.", "Planificación", "Criterios comunicados, coordinación de recursos y seguimiento.", "¿Qué información usaste para priorizar?", "¿Cómo verificaste el avance?"),
      prompt("Describí cómo abordaste una desviación de calidad o un incumplimiento de procedimiento en el equipo.", "Calidad y estándares", "Respuesta concreta, comunicación y seguimiento para prevenir repetición.", "¿Qué hiciste primero?", "¿Cómo acompañaste la corrección?"),
      prompt("Contame de una ocasión en la que tuviste que intervenir ante un riesgo de seguridad.", "Prevención y cuidado", "Acciones para reducir exposición, comunicar y dar seguimiento.", "¿Cómo verificaste que el riesgo estuviera controlado?", "¿Qué aprendizaje compartiste con el equipo?"),
      prompt("Describí cómo acompañaste a una persona del equipo que necesitaba aprender una tarea.", "Liderazgo y desarrollo", "Instrucciones, práctica y verificación del aprendizaje.", "¿Cómo adaptaste el acompañamiento?", "¿Qué observaste después?"),
      prompt("¿Qué hiciste para resolver un desacuerdo entre integrantes del equipo durante una jornada?", "Gestión de conflictos", "Escucha de las partes, foco en hechos y acuerdo de trabajo.", "¿Cómo evitaste tomar partido sin escuchar?", "¿Qué seguimiento hiciste luego?"),
      prompt("Contame de una mejora operativa que hayas impulsado o coordinado.", "Mejora continua", "Problema, participación del equipo y resultado observable.", "¿Cómo involucraste a quienes realizan la tarea?", "¿Cómo comprobaste el efecto de la mejora?"),
    ],
  },
  {
    id: "recepcionista",
    name: "Recepcionista",
    questions: [
      prompt("Contame de una ocasión en la que tuviste que atender a varias personas o llamadas casi al mismo tiempo.", "Organización y atención", "Cómo ordenó la atención y comunicó tiempos de espera.", "¿Qué criterio usaste para decidir el orden?", "¿Cómo retomaste cada pedido?"),
      prompt("Describí una interacción difícil con una persona visitante o que llamó a la organización.", "Comunicación y servicio", "Escucha, tono profesional y pasos concretos para atender la situación.", "¿Qué necesitaba esa persona?", "¿Cómo cerraste o derivaste la conversación?"),
      prompt("¿Cómo actuaste cuando alguien pidió información que no estabas autorizado/a a compartir?", "Confidencialidad", "Límites claros y derivación al canal o persona adecuados.", "¿Qué respuesta diste?", "¿Cómo resguardaste la información?"),
      prompt("Contame de una vez que recibiste un pedido urgente mientras realizabas otra tarea.", "Priorización", "Evaluación del pedido, comunicación y coordinación del siguiente paso.", "¿Qué confirmaste antes de interrumpir la tarea?", "¿Qué quedó pendiente y cómo lo seguiste?"),
      prompt("Describí una situación en la que tuviste que orientar a alguien con información que podía resultar confusa.", "Claridad", "Indicaciones simples y comprobación de que la persona sabía cómo continuar.", "¿Cómo adaptaste las indicaciones?", "¿Qué hiciste si la primera explicación no alcanzó?"),
      prompt("Contame cómo organizaste mensajes, visitas o tareas para evitar que algo importante quedara sin atender.", "Registro y seguimiento", "Sistema de registro y traspaso de información suficiente.", "¿Qué datos registrabas?", "¿Cómo confirmabas que el destinatario recibió el mensaje?"),
    ],
  },
  {
    id: "reposicion",
    name: "Repositor/a",
    questions: [
      prompt("Contame de una jornada en la que tuviste que reponer productos de varias áreas.", "Organización", "Secuencia de tareas y cuidado del orden mientras reponía.", "¿Cómo definiste por dónde empezar?", "¿Cómo verificaste qué quedaba pendiente?"),
      prompt("Describí una ocasión en la que advertiste productos dañados o con información de fecha que requería revisión.", "Atención al producto", "Cómo separó o comunicó el producto según el procedimiento del lugar.", "¿Qué criterio aplicaste?", "¿A quién informaste y qué pasó después?"),
      prompt("¿Qué hiciste al encontrar una diferencia entre el producto disponible y lo indicado en el registro o pedido?", "Control de stock", "Verificaciones antes de actualizar o comunicar la diferencia.", "¿Qué revisaste para confirmarla?", "¿Cómo quedó registrada o resuelta?"),
      prompt("Contame de una interacción en la que una persona cliente necesitó ayuda mientras estabas reponiendo.", "Servicio al cliente", "Cómo respondió sin descuidar seguridad ni dejar tareas sin seguimiento.", "¿Qué necesitaba la persona?", "¿Cómo retomaste la tarea?"),
      prompt("Describí cómo actuaste al encontrar un bulto, equipo o pasillo que podía dificultar la circulación.", "Seguridad y orden", "Acción preventiva y comunicación adecuada.", "¿Qué riesgo observaste?", "¿Qué cambió después de reportarlo?"),
      prompt("Contame de una vez que tuviste que coordinar reposición con otras personas o con una entrega.", "Trabajo en equipo", "Cómo compartió información y acordó responsabilidades.", "¿Qué necesitaban coordinar?", "¿Cómo comprobaron que todo quedara ordenado?"),
    ],
  },
  {
    id: "cajero",
    name: "Cajero/a",
    questions: [
      prompt("Contame cómo actuaste al notar una diferencia entre un cobro y el importe que esperabas registrar.", "Precisión", "Verificaciones ordenadas y comunicación según el procedimiento.", "¿Qué revisaste antes de corregir?", "¿Cómo se cerró la situación?"),
      prompt("Describí una atención complicada en la que tuviste que mantener claridad y respeto.", "Atención al cliente", "Escucha, explicación clara y búsqueda de ayuda cuando fue necesario.", "¿Qué necesitaba resolver la persona?", "¿Qué resultado tuvo el intercambio?"),
      prompt("¿Qué hiciste durante un momento de mucha fila o presión por atender con rapidez?", "Ritmo y atención", "Cómo sostuvo precisión y pidió apoyo o comunicó demoras.", "¿Qué priorizaste en cada operación?", "¿Cómo evitaste que la rapidez generara errores?"),
      prompt("Contame de una ocasión en que necesitaste apoyo para resolver una consulta o una operación inusual.", "Criterio y consulta", "Reconocimiento de límites y consulta al canal adecuado.", "¿Qué información reuniste antes de consultar?", "¿Qué aprendiste para otra ocasión?"),
      prompt("Describí cómo organizaste tareas de caja y otras tareas asignadas durante un turno.", "Organización", "Seguimiento de tareas sin perder el control de cobros y pendientes.", "¿Cómo registrabas lo que quedaba por hacer?", "¿Cómo entregabas el turno o la información?"),
      prompt("Contame de una vez que tuviste que resguardar información o valores durante tu trabajo.", "Responsabilidad", "Acciones concretas para seguir controles y reportar diferencias.", "¿Qué pasos del procedimiento aplicaste?", "¿Qué resultado verificable obtuviste?"),
    ],
  },
  {
    id: "ejecutivo-comercial",
    name: "Ejecutivo/a comercial",
    questions: [
      prompt("Contame de una oportunidad en la que identificaste una necesidad comercial que no estaba expresada de entrada.", "Descubrimiento de necesidades", "Preguntas, escucha y validación antes de proponer.", "¿Qué te hizo profundizar?", "¿Cómo verificaste tu interpretación?"),
      prompt("Describí una negociación en la que tuviste que equilibrar necesidades del cliente y condiciones disponibles.", "Negociación", "Preparación, límites claros y acuerdos concretos.", "¿Qué aspectos eran negociables?", "¿Cómo quedó documentado el acuerdo?"),
      prompt("Contame de una cuenta o relación comercial que hayas sostenido a lo largo del tiempo.", "Gestión de relaciones", "Seguimiento consistente y comprensión de cambios en las necesidades.", "¿Cómo organizabas los contactos?", "¿Qué resultado o aprendizaje obtuviste?"),
      prompt("¿Qué hiciste ante un período en que tus oportunidades o avances comerciales se alejaron del objetivo esperado?", "Gestión de resultados", "Revisión de indicadores, acciones ajustadas y comunicación transparente.", "¿Qué señales revisaste primero?", "¿Qué cambiaste y qué efecto tuvo?"),
      prompt("Describí cómo mantuviste ordenada la información de oportunidades y próximos pasos.", "Gestión de cartera", "Registro utilizable y prioridades de seguimiento.", "¿Qué información considerabas imprescindible?", "¿Cómo evitabas que se perdiera un compromiso?"),
      prompt("Contame de una ocasión en que una solución no era adecuada para una necesidad del cliente.", "Ética comercial", "Transparencia sobre el encaje y propuesta de una alternativa realista.", "¿Cómo lo explicaste?", "¿Qué efecto tuvo en la relación?"),
    ],
  },
  {
    id: "responsable-gerente-rrhh",
    name: "Responsable / gerente de RRHH",
    questions: [
      prompt("Contame de una decisión de gestión de personas que hayas tenido que alinear con prioridades del negocio.", "Criterio estratégico", "Necesidad identificada, alternativas y criterios para evaluar el efecto.", "¿Qué información consideraste?", "¿Cómo revisaste los resultados?"),
      prompt("Describí un cambio organizacional o de prácticas de RRHH que hayas acompañado.", "Gestión del cambio", "Participación de actores, comunicación y seguimiento de adopción.", "¿Qué resistencias o necesidades aparecieron?", "¿Qué ajustarías hoy?"),
      prompt("Contame de una situación compleja de relaciones laborales o de personas que requirió criterio y reserva.", "Criterio y confidencialidad", "Manejo prudente, consulta apropiada y resguardo de la información.", "¿Cómo delimitaste lo que podía compartirse?", "¿Qué aprendizaje dejó el proceso?"),
      prompt("¿Cómo desarrollaste a un equipo de RRHH o distribuiste responsabilidades ante prioridades concurrentes?", "Liderazgo de equipos", "Alineación de prioridades, claridad de responsabilidades y acompañamiento.", "¿Cómo abordaste diferencias de capacidad o carga?", "¿Qué señales usaste para revisar el avance?"),
      prompt("Describí una decisión de RRHH que hayas informado con datos sin reducir la situación a un único indicador.", "Decisiones basadas en evidencia", "Fuentes y límites de los datos, contexto y criterio de decisión.", "¿Qué información adicional necesitaste?", "¿Cómo comunicaste incertidumbres?"),
      prompt("Contame de una iniciativa de RRHH que no obtuvo el resultado esperado.", "Aprendizaje y mejora", "Reconocimiento de brechas, escucha de afectados y ajuste posterior.", "¿Qué evidencia te mostró que había que cambiar?", "¿Qué hiciste distinto después?"),
    ],
  },
];

export const SENIORITY_LEVELS = [
  { id: "inicial", name: "Inicial", focus: "Priorizá un ejemplo concreto: qué aprendiste, qué pasos realizaste y cuándo pediste apoyo." },
  { id: "intermedio", name: "Intermedio", focus: "Explicá cómo organizaste la tarea con autonomía, coordinaste con otras personas y verificaste el resultado." },
  { id: "avanzado", name: "Avanzado", focus: "Detallá tu criterio para decidir, cómo anticipaste riesgos y qué impacto o aprendizaje dejó la experiencia." },
  { id: "liderazgo", name: "Liderazgo / coordinación", focus: "Sumá cómo alineaste al equipo, distribuiste responsabilidades y diste seguimiento a resultados y aprendizajes." },
] as const;
