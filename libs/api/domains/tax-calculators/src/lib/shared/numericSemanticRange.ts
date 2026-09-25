import type { CalculatorFieldSemantic } from '@island.is/clients/rsk/calculators'

export interface NumericSemanticRange {
  min?: number
  max?: number
}

/* The one place these bounds are declared -- both the published contract
 * (fields/inputField) and the enforced validation (calculate/submission) read
 * from here, so they cannot drift apart. */
export const NUMERIC_SEMANTIC_RANGE: Partial<
  Record<CalculatorFieldSemantic, NumericSemanticRange>
> = {
  percentage: { min: 0, max: 100 },
  month: { min: 1, max: 12 },
  count: { min: 0 },
}
