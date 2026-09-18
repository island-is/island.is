import type {
  TaxCalculatorInputFieldValue,
  TaxCalculatorInputValue,
} from '@island.is/web/graphql/schema'
import { TaxCalculatorInputFieldType } from '@island.is/web/graphql/schema'

import type { ApplicableFields, FormValues } from './applicability'
import { isInPlay } from './applicability'
import { toTypedValue } from './values'

/* `TaxCalculatorInputValue` is a `@oneOf` input, which codegen emits as a union
 * whose other members are `?: never`. Building the object by assignment would
 * satisfy none of them, so each branch returns a complete member.
 *
 * A member present as `null` is rejected by coercion exactly as a second
 * populated one is, which is why absence is handled before this is ever
 * reached: a cleared control omits its whole row rather than sending an empty
 * payload. */
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

/* The only place form state becomes a GraphQL payload. It dispatches on
 * metadata `type`, never on which control rendered the field: `year` and
 * `month` are `number`-typed yet rendered as selects, and a text input and a
 * currency input both hand back a string.
 *
 * `0` and `false` survive, because absence is decided in `toTypedValue` before
 * any coercion -- `Number('')` is `0`, so testing the coerced value would
 * submit every untouched numeric field as a zero. For `withholdingTax`, whose
 * fields are all optional and whose absent values fall back to RSK's own
 * defaults, that would corrupt the calculation rather than fail it. */
export const toInputFieldValues = (
  applicable: ApplicableFields,
  values: FormValues,
): TaxCalculatorInputFieldValue[] => {
  const rows: TaxCalculatorInputFieldValue[] = []

  for (const [key, entry] of applicable) {
    /* A field in a `disableOnly` section whose gate is shut renders, but is not
     * in play -- react-hook-form still holds its value, so it has to be
     * excluded explicitly rather than by unmounting. */
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
