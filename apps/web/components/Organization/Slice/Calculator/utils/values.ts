import { TaxCalculatorInputFieldType } from '@island.is/web/graphql/schema'

/* Every control except the boolean checkbox writes a string into form state, so
 * metadata `type` is the only reliable signal of what a value means. Both the
 * dependency check and the serializer read form state through this -- coercing
 * in one and not the other is how they come to disagree. */
export type TypedValue = string | number | boolean

export const toTypedValue = (
  value: unknown,
  type: TaxCalculatorInputFieldType,
): TypedValue | undefined => {
  /* `Number('')` is `0`, so absence must be checked before coercion or an
   * untouched numeric field submits a zero. */
  if (value === '' || value === null || value === undefined) return undefined

  switch (type) {
    /* `Number('-')` and `Number('.')` are NaN and both reach form state
     * mid-typing. Absent here, so the submit gate sees it rather than the
     * serializer silently dropping it. */
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
