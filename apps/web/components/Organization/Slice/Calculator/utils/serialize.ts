import type {
  TaxCalculatorInputFieldValue,
  TaxCalculatorInputValue,
} from '@island.is/web/graphql/schema'
import { TaxCalculatorInputFieldType } from '@island.is/web/graphql/schema'

import type { ApplicableFields, FormValues } from './applicability'
import { isUsedForCalculation } from './applicability'
import { toTypedValue } from './values'

/* `TaxCalculatorInputValue` is a `@oneOf` input, emitted as a union whose other
 * members are `?: never`, so each branch returns a complete member rather than
 * building one by assignment. */
const toInputValue = (
  value: string | number | boolean,
  type: TaxCalculatorInputFieldType,
): TaxCalculatorInputValue | undefined => {
  switch (type) {
    case TaxCalculatorInputFieldType.Number:
      return typeof value === 'number' && Number.isFinite(value)
        ? { numberValue: value }
        : undefined
    case TaxCalculatorInputFieldType.Boolean:
      return typeof value === 'boolean' ? { booleanValue: value } : undefined
    case TaxCalculatorInputFieldType.String:
    case TaxCalculatorInputFieldType.Date:
    case TaxCalculatorInputFieldType.Select:
      return typeof value === 'string' ? { stringValue: value } : undefined
    default: {
      const unhandled: never = type
      return unhandled
    }
  }
}

/* Dispatches on metadata `type`, never on which control rendered the field --
 * `year` and `month` are `number`-typed yet rendered as selects. `0` and
 * `false` survive because absence is decided in `toTypedValue` first. */
export const toInputFieldValues = (
  applicable: ApplicableFields,
  values: FormValues,
): TaxCalculatorInputFieldValue[] => {
  const rows: TaxCalculatorInputFieldValue[] = []

  for (const [key, entry] of applicable) {
    /* A `disableOnly` field renders but does not participate in the
     * calculation, and react-hook-form still holds its value. */
    if (!isUsedForCalculation(entry)) continue

    const { contractField } = entry
    const typed = toTypedValue(values[key], contractField.type)
    if (typed === undefined) continue

    const value = toInputValue(typed, contractField.type)
    if (!value) continue

    rows.push({ key, value })
  }

  return rows
}
