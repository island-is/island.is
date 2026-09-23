import { TaxCalculatorInputFieldType } from '@island.is/web/graphql/schema'

/* Coerces form values consistently for gating and serialization. */
export type TypedValue = string | number | boolean

export const toTypedValue = (
  value: unknown,
  type: TaxCalculatorInputFieldType,
): TypedValue | undefined => {
  /* Preserves blank numeric fields as absent. */
  if (value === '' || value === null || value === undefined) return undefined

  switch (type) {
    /* Treats incomplete numeric input as absent. */
    case TaxCalculatorInputFieldType.Number: {
      const parsed = Number(value)
      return Number.isFinite(parsed) ? parsed : undefined
    }
    case TaxCalculatorInputFieldType.Boolean:
      return Boolean(value)
    case TaxCalculatorInputFieldType.String:
    case TaxCalculatorInputFieldType.Date:
    case TaxCalculatorInputFieldType.Select:
      return String(value)
    default: {
      const unhandled: never = type
      return unhandled
    }
  }
}
