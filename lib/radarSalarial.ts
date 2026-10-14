// RADAR SALARIAL — referencias de remuneración de mercado por puesto.
//
// REGLA: no se publica ninguna cifra sin fuente verificable. Esta lista arranca VACÍA a propósito.
// Para cargar una referencia, agregá un objeto a RADAR_DATA con TODOS los campos obligatorios.
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
  reference: number;         // valor de referencia (mediana, promedio o el que informe la fuente)
  referenceKind: string;     // qué es "reference": "mediana", "promedio", "punto medio", etc.
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
  { id: "responsable-gerente-rrhh", name: "Responsable / gerente de RRHH" },
] as const;

// Datos validados. VACÍO hasta contar con fuentes verificables.
export const RADAR_DATA: RadarEntry[] = [];

const isPositive = (value: unknown): value is number => typeof value === "number" && Number.isFinite(value) && value > 0;

export function isPublishable(entry: RadarEntry): boolean {
  const known = RADAR_POSITIONS.some((position) => position.id === entry.positionId);
  const dateOk = /^\d{4}-\d{2}-\d{2}$/.test(entry.referenceDate) && !Number.isNaN(Date.parse(entry.referenceDate));
  const urlOk = /^https:\/\/[^\s]+$/.test(entry.sourceUrl);
  const rangeOk = isPositive(entry.min) && isPositive(entry.max) && isPositive(entry.reference) && entry.min <= entry.reference && entry.reference <= entry.max;
  const textsOk = [entry.zone, entry.referenceKind, entry.experience, entry.workload, entry.sourceName].every((text) => typeof text === "string" && text.trim() !== "");
  const sampleOk = entry.sampleSize === undefined || (Number.isInteger(entry.sampleSize) && entry.sampleSize > 0);
  return known && dateOk && urlOk && rangeOk && textsOk && sampleOk && ["alta", "media", "baja"].includes(entry.confidence);
}

export function entriesFor(positionId: string, data: RadarEntry[] = RADAR_DATA): RadarEntry[] {
  return data.filter((entry) => entry.positionId === positionId && isPublishable(entry));
}
