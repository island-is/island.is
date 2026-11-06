import type {
  TaxCalculatorCalculation,
  TaxCalculatorOutputFieldValue,
  TaxCalculatorOutputFieldValueRow,
  TaxCalculatorOutputScalarValue,
} from '@island.is/web/graphql/schema'

export type OutputValue = TaxCalculatorOutputFieldValue
export type OutputRow = TaxCalculatorOutputFieldValueRow
export type OutputScalarValue = TaxCalculatorOutputScalarValue

export type OutputValues = Map<string, OutputValue>

export const toOutputValues = (
  calculation: TaxCalculatorCalculation,
): OutputValues =>
  new Map(calculation.values.map((value) => [value.key, value]))

export const itemValue = (
  row: OutputRow,
  key: string,
): OutputScalarValue | undefined =>
  row.values.find((value) => value.key === key)
