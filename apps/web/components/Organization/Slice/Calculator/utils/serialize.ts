import type {
  TaxCalculatorInputFieldValue,
  TaxCalculatorInputValue,
} from '@island.is/web/graphql/schema'
import { TaxCalculatorInputFieldType } from '@island.is/web/graphql/schema'

import type { ApplicableFields, FormValues } from './applicability'
import { isInPlay } from './applicability'
import { toTypedValue } from './values'

/* Builds complete GraphQL one-of members. */
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

/* Serializes values by metadata type. */
export const toInputFieldValues = (
  applicable: ApplicableFields,
  values: FormValues,
): TaxCalculatorInputFieldValue[] => {
  const rows: TaxCalculatorInputFieldValue[] = []

  for (const [key, entry] of applicable) {
    /* Excludes disabled fields retained by react-hook-form. */
    if (!isInPlay(entry)) continue

    const { contractField } = entry
    const typed = toTypedValue(values[key], contractField.type)
    if (typed === undefined) continue

    const value = toInputValue(typed, contractField.type)
    if (!value) continue

    rows.push({ key, value })
  }

  return rows
}
