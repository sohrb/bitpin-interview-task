import { Decimal } from "decimal.js";

Decimal.set({ rounding: Decimal.ROUND_DOWN });

export function toDecimal(value: string | number) {
  return new Decimal(value);
}
