import { CalculatorResultRow } from '../models/resultRow.model'

export const buildRow = (
  key: string,
  label: string,
  value: number | bigint | string | boolean | null | undefined,
  options?: { unit?: string; group?: string; emphasis?: boolean },
): CalculatorResultRow | undefined => {
  if (value === null || value === undefined) {
    return undefined
  }
  const row = new CalculatorResultRow()
  row.key = key
  row.label = label
  row.value = String(value)
  row.unit = options?.unit
  row.group = options?.group
  row.emphasis = options?.emphasis
  return row
}
