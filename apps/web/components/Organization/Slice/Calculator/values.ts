import { TaxCalculatorInputFieldType } from '@island.is/web/graphql/schema'

/* Every control except the boolean checkbox writes a string into form state --
 * including the selects behind `year` and `month`, which metadata types as
 * `number`. So the control that rendered a field says nothing about what its
 * value is, and metadata `type` is the only reliable signal.
 *
 * This is the single authority on what a raw form value means. Both readers of
 * form state go through it: the dependency check that decides whether a field
 * applies, and the serializer that submits it. Coercing in one and not the
 * other is how the two come to disagree about which fields are in play. */
export type TypedValue = string | number | boolean

export const toTypedValue = (
  value: unknown,
  type: TaxCalculatorInputFieldType,
): TypedValue | undefined => {
  /* Absent before coerced, never the other way round: `Number('')` is `0`, so
   * coercing first turns an untouched numeric field into a submitted zero. */
  if (value === '' || value === null || value === undefined) return undefined

  switch (type) {
    case TaxCalculatorInputFieldType.Number:
      return Number(value)
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
