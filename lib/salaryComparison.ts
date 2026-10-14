// Comparación aritmética entre valores que ingresa la persona. NO estima ni usa datos de mercado.
// Fórmulas recuperadas del commit de42046 ("Agrega herramientas de empleabilidad y enlace institucional"):
//   Objetivo           = remuneración actual × (1 + porcentaje objetivo ÷ 100)
//   Variación oferta   = oferta − remuneración actual   (y como % de la actual, si actual > 0)
//   Oferta − objetivo  = oferta − objetivo
//   Oferta − piso      = oferta − piso personal

// null = campo vacío; NaN = valor inválido (negativo o no numérico).
export function parseAmount(rawValue: string): number | null {
  if (rawValue.trim() === "") return null;
  const amount = Number(rawValue);
  return Number.isFinite(amount) && amount >= 0 ? amount : Number.NaN;
}

export type SalaryComparison = {
  current: number | null;
  floor: number | null;
  offer: number | null;
  percent: number | null;
  hasError: boolean;
  target: number | null;
  offerMinusCurrent: number | null;
  offerVsCurrentPercent: number | null;
  offerMinusTarget: number | null;
  offerMinusFloor: number | null;
};

const roundCents = (value: number) => Math.round((value + Number.EPSILON) * 100) / 100;

export function compareSalary(rawCurrent: string, rawFloor: string, rawOffer: string, rawPercent: string): SalaryComparison {
  const current = parseAmount(rawCurrent);
  const floor = parseAmount(rawFloor);
  const offer = parseAmount(rawOffer);
  const percent = rawPercent.trim() === "" ? null : Number(rawPercent);
  const invalidAmounts = [current, floor, offer].some((value) => typeof value === "number" && !Number.isFinite(value));
  const invalidPercent = percent !== null && (!Number.isFinite(percent) || percent < 0);
  const hasError = invalidAmounts || invalidPercent;

  const empty: SalaryComparison = { current, floor, offer, percent, hasError, target: null, offerMinusCurrent: null, offerVsCurrentPercent: null, offerMinusTarget: null, offerMinusFloor: null };
  if (hasError) return empty;

  const target = current !== null && percent !== null ? roundCents(current * (1 + percent / 100)) : null;
  return {
    ...empty,
    target,
    offerMinusCurrent: offer !== null && current !== null ? roundCents(offer - current) : null,
    offerVsCurrentPercent: offer !== null && current !== null && current > 0 ? ((offer - current) / current) * 100 : null,
    offerMinusTarget: offer !== null && target !== null ? roundCents(offer - target) : null,
    offerMinusFloor: offer !== null && floor !== null ? roundCents(offer - floor) : null,
  };
}
