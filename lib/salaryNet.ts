// Descuentos legales básicos de un sueldo en relación de dependencia, usados también
// por la calculadora bruto → neto: jubilación 11 %, obra social 3 % y PAMI 3 %.
export const BASIC_DEDUCTION_RATES = { retirement: 0.11, health: 0.03, inssjp: 0.03 } as const;
export const TOTAL_BASIC_RATE = BASIC_DEDUCTION_RATES.retirement + BASIC_DEDUCTION_RATES.health + BASIC_DEDUCTION_RATES.inssjp;

const round2 = (value: number) => Math.round((value + Number.EPSILON) * 100) / 100;

export type NetToGrossResult = {
  net: number;
  gross: number;
  retirement: number;
  health: number;
  inssjp: number;
  totalDeductions: number;
};

// Si el neto es lo que queda después de descontar el 17 % del bruto, entonces bruto = neto ÷ (1 − 0,17).
// Es un piso: si además hay Ganancias, aportes sindicales u otros descuentos, el bruto real sería mayor.
export function netToGross(net: number): NetToGrossResult | null {
  if (!Number.isFinite(net) || net < 0) return null;
  const gross = net / (1 - TOTAL_BASIC_RATE);
  const retirement = round2(gross * BASIC_DEDUCTION_RATES.retirement);
  const health = round2(gross * BASIC_DEDUCTION_RATES.health);
  const inssjp = round2(gross * BASIC_DEDUCTION_RATES.inssjp);
  return { net, gross: round2(gross), retirement, health, inssjp, totalDeductions: round2(retirement + health + inssjp) };
}
