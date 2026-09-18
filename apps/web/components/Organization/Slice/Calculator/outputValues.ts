import type { GetTaxCalculatorCalculationQuery } from '@island.is/web/graphql/schema'

type Calculation = NonNullable<
  NonNullable<
    GetTaxCalculatorCalculationQuery['taxCalculatorCalculate']
  >['calculation']
>

export type OutputValue = Calculation['values'][number]
export type OutputRow = NonNullable<OutputValue['arrayValue']>[number]
export type OutputScalarValue = OutputRow['values'][number]

/* Keyed by output field key, as `config.outputSections` references them. A map
 * rather than the array the query returns, because every configured row looks
 * up the one value its `key` points at -- and a key RSK returned nothing for is
 * simply absent from `values`, which is how such a row gets omitted instead of
 * rendering an empty one. */
export type OutputValues = Map<string, OutputValue>

export const toOutputValues = (calculation: Calculation): OutputValues =>
  new Map(calculation.values.map((value) => [value.key, value]))

/* A row omits keys RSK returned no value for, so rows are not guaranteed to be
 * the same shape. Looked up per item field rather than by position for exactly
 * that reason. */
export const itemValue = (
  row: OutputRow,
  key: string,
): OutputScalarValue | undefined =>
  row.values.find((value) => value.key === key)
