import type { GetTaxCalculatorCalculationQuery } from '@island.is/web/graphql/schema'

type Calculation = NonNullable<
  NonNullable<
    GetTaxCalculatorCalculationQuery['taxCalculatorCalculate']
  >['calculation']
>

export type OutputValue = Calculation['values'][number]
export type OutputRow = NonNullable<OutputValue['arrayValue']>[number]
export type OutputScalarValue = OutputRow['values'][number]

export type OutputValues = Map<string, OutputValue>

export const toOutputValues = (calculation: Calculation): OutputValues =>
  new Map(calculation.values.map((value) => [value.key, value]))

/* Rows omit keys RSK returned nothing for, so they are not guaranteed to share
 * a shape -- hence lookup by key, not position. */
export const itemValue = (
  row: OutputRow,
  key: string,
): OutputScalarValue | undefined =>
  row.values.find((value) => value.key === key)
