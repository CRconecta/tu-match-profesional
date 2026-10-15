// RADAR SALARIAL — referencias de remuneración de mercado por puesto.
//
// REGLA: no se publica ninguna cifra sin fuente verificable (con enlace y fecha). Las cifras de abajo son las que
// medios reconocidos publicaron citando estudios de Randstad, Michael Page, ZonaJobs y Bumeran; NO provienen de los
// informes completos. Cada una conserva su fuente, su fecha y sus advertencias.
// Para cargar una referencia, agregá un objeto a RADAR_DATA con todos los campos obligatorios.
// Una entrada incompleta o con datos inválidos no se muestra nunca (ver isPublishable).
// No cargues cifras estimadas, recordadas o sin enlace a la fuente original.

export type Confidence = "alta" | "media" | "baja";

export type RadarEntry = {
  positionId: string;        // id del puesto (ver RADAR_POSITIONS)
  zone: string;              // p. ej. "AMBA", "Córdoba", "Argentina (nacional)"
  amountType: "bruto" | "neto";
  period: "mensual" | "anual" | "por hora";
  currency: "ARS";
  min: number;               // valor mínimo del rango publicado
  max: number;               // valor máximo del rango publicado
  reference?: number;        // valor de referencia que informe la fuente (opcional: no se calcula ni se estima)
  referenceKind: string;     // qué es "reference" (o el valor publicado): "mediana", "promedio", "valor aproximado informado", etc.
  sourceLabel?: string;      // nombre del puesto tal como lo escribe la fuente, si difiere
  note?: string;             // advertencia de la fuente sobre el dato
  experience: string;        // p. ej. "1 a 3 años", "sin experiencia previa"
  workload: string;          // jornada y modalidad: "completa, presencial", etc.
  referenceDate: string;     // fecha a la que corresponde el dato, formato AAAA-MM-DD
  sourceName: string;        // nombre de la fuente
  sourceUrl: string;         // enlace https a la fuente original
  sampleSize?: number;       // tamaño de muestra, solo si la fuente lo informa
  confidence: Confidence;    // alta: fuente oficial/metodología clara y muestra informada; media; baja
};

export const RADAR_POSITIONS = [
  { id: "operario-produccion", name: "Operario/a de producción" },
  { id: "deposito", name: "Depósito" },
  { id: "administrativo", name: "Administrativo/a" },
  { id: "administrativo-rrhh", name: "Administrativo/a de RRHH" },
  { id: "atencion-cliente", name: "Atención al cliente" },
  { id: "vendedor", name: "Vendedor/a" },
  { id: "analista-administrativo", name: "Analista administrativo/a" },
  { id: "supervisor-produccion", name: "Supervisor/a de producción" },
  { id: "recepcionista", name: "Recepcionista" },
  { id: "repositor", name: "Repositor/a" },
  { id: "cajero", name: "Cajero/a" },
  { id: "ejecutivo-comercial", name: "Ejecutivo/a comercial" },
  { id: "jefe-rrhh", name: "Jefe/a de RRHH" },
  { id: "responsable-gerente-rrhh", name: "Responsable / gerente de RRHH" },
  { id: "picker-packer", name: "Picker / packer" },
  { id: "preventista", name: "Preventista" },
  { id: "camarero-eventos", name: "Camarero/a de eventos" },
] as const;

const MERCADO_RANDSTAD = {
  zone: "Argentina (nacional)", amountType: "bruto", period: "mensual", currency: "ARS", referenceKind: "valor aproximado informado",
  experience: "Nivel inicial (posición operativa entry level, según la nota)", workload: "No informada por la fuente",
  referenceDate: "2026-07-23", sourceName: "Randstad, según Revista Mercado",
  sourceUrl: "https://mercado.com.ar/talento-y-liderazgo/randstad-relevo-siete-puestos-operativos-entry-level-con-demanda-activa-en-el-segundo-semestre",
  note: "La nota presenta el monto como aproximado y no informa muestra ni método de relevamiento. Usa el símbolo $.", confidence: "baja",
} as const;
const entry = (positionId: string, sourceLabel: string, value: number): RadarEntry => ({ ...MERCADO_RANDSTAD, positionId, sourceLabel, min: value, max: value, reference: value });

const IPROUP = {
  zone: "Argentina (nacional)", amountType: "bruto", period: "mensual", currency: "ARS", referenceKind: "rango publicado",
  experience: "No informada por la fuente", workload: "No informada por la fuente", referenceDate: "2026-04-29",
  sourceUrl: "https://www.iproup.com/empleo/67339-que-salario-gana-un-gerente-de-recursos-humanos-en-mayo-de-2026", confidence: "baja",
} as const;

// Datos validados con fuente y enlace. Las referencias salen de notas periodísticas, no de los informes completos.
export const RADAR_DATA: RadarEntry[] = [
  entry("deposito", "Operario de depósito", 1_550_000),
  entry("picker-packer", "Picker/packer", 1_200_000),
  entry("vendedor", "Vendedor y atención al cliente en salón", 1_500_000),
  entry("repositor", "Repositor", 1_250_000),
  entry("preventista", "Preventista", 1_300_000),
  entry("camarero-eventos", "Camarero/mozo de eventos", 1_500_000),
  entry("cajero", "Cajero de punto de venta", 1_300_000),
  { ...IPROUP, positionId: "responsable-gerente-rrhh", sourceLabel: "Gerente de RRHH", min: 5_500_000, max: 12_500_000,
    sourceName: "Guía Salarial 2026 de Michael Page y relevamientos complementarios, según iProUP",
    note: "La nota no informa muestra ni fechas de relevamiento, y aclara que los importes no incluyen beneficios adicionales." },
  { ...IPROUP, positionId: "jefe-rrhh", sourceLabel: "Jefe de RRHH", min: 4_400_000, max: 7_500_000,
    sourceName: "Guía Salarial 2026 de Michael Page y relevamientos complementarios, según iProUP",
    note: "La nota no informa muestra ni fechas de relevamiento, y aclara que los importes no incluyen beneficios adicionales." },
  { ...IPROUP, positionId: "responsable-gerente-rrhh", sourceLabel: "Gerente de RRHH", min: 3_800_000, max: 7_500_000, sourceName: "ZonaJobs y Bumeran, según iProUP",
    note: "La nota aclara que estos datos suelen reflejar puestos más tradicionales y no consideran la inflación ni la dolarización parcial de paquetes de multinacionales." },
  { ...IPROUP, positionId: "jefe-rrhh", sourceLabel: "Jefe de RRHH", min: 2_200_000, max: 3_800_000, sourceName: "ZonaJobs y Bumeran, según iProUP",
    note: "La nota aclara que estos datos suelen reflejar puestos más tradicionales y no consideran la inflación ni la dolarización parcial de paquetes de multinacionales." },
  { positionId: "jefe-rrhh", sourceLabel: "Jefe de RRHH", zone: "Argentina (sin región especificada en la nota)", amountType: "bruto", period: "mensual", currency: "ARS",
    min: 3_600_000, max: 5_800_000, referenceKind: "rango entre sectores (servicios a banca e IT)", experience: "No informada por la fuente", workload: "No informada por la fuente",
    referenceDate: "2026-01-19", sourceName: "Randstad Argentina (datos cerrados a enero de 2026), según iProfesional",
    sourceUrl: "https://www.iprofesional.com/management/446049-que-sueldo-cobra-un-director-un-jefe-y-un-gerente-en-febrero-2026",
    note: "La nota habla de remuneración bruta mensual sin adicionales ni comisiones, pero no informa muestra ni método.", confidence: "media" },
];

const isPositive = (value: unknown): value is number => typeof value === "number" && Number.isFinite(value) && value > 0;

export function isPublishable(entry: RadarEntry): boolean {
  const known = RADAR_POSITIONS.some((position) => position.id === entry.positionId);
  const dateOk = /^\d{4}-\d{2}-\d{2}$/.test(entry.referenceDate) && !Number.isNaN(Date.parse(entry.referenceDate));
  const urlOk = /^https:\/\/[^\s]+$/.test(entry.sourceUrl);
  const rangeOk = isPositive(entry.min) && isPositive(entry.max) && entry.min <= entry.max
    && (entry.reference === undefined || (isPositive(entry.reference) && entry.min <= entry.reference && entry.reference <= entry.max));
  const textsOk = [entry.zone, entry.referenceKind, entry.experience, entry.workload, entry.sourceName].every((text) => typeof text === "string" && text.trim() !== "");
  const sampleOk = entry.sampleSize === undefined || (Number.isInteger(entry.sampleSize) && entry.sampleSize > 0);
  return known && dateOk && urlOk && rangeOk && textsOk && sampleOk && ["alta", "media", "baja"].includes(entry.confidence);
}

export function entriesFor(positionId: string, data: RadarEntry[] = RADAR_DATA): RadarEntry[] {
  return data.filter((entry) => entry.positionId === positionId && isPublishable(entry));
}
