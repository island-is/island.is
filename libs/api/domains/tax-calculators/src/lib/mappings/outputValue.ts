import type {
  CalculatorOutputField,
  CalculatorScalarOutputField,
} from '@island.is/clients/rsk/calculators'

import { TaxCalculatorOutputFieldType } from '../models/enums'
import type { OutputFieldValue } from '../models/outputFieldValue.model'
import type { OutputFieldValueRow } from '../models/outputFieldValueRow.model'
import type { OutputScalarValue } from '../models/outputScalarValue.model'
import { OUTPUT_FIELD_TYPE_BY_CLIENT_TYPE } from './outputField'

/* Driven by the contract, not by the result: which keys a calculator can
 * return is metadata, so anything RSK sends that the contract does not declare
 * is ignored rather than published unannounced.
 *
 * Runs against the client contract for the same reason validation does -- the
 * mapped models only discriminate array from scalar through __typename, while
 * `kind` narrows here. `name` is the public `key`, one to one.
 *
 * Entries rather than index access: the client output interfaces declare no
 * index signature, so a runtime key cannot be read off them directly, and this
 * is the alternative to asserting one. */
const entriesOf = (value: unknown): Map<string, unknown> =>
  typeof value === 'object' && value !== null
    ? new Map(Object.entries(value))
    : new Map()

/* Exclusivity is structural: each branch builds one literal with one payload
 * key, so a value carrying two payloads is not constructible. A value whose
 * runtime kind contradicts the contract is omitted rather than coerced --
 * client drift should read as a missing value, not a wrong one. */
const toScalarPayload = (
  field: CalculatorScalarOutputField,
  raw: unknown,
): Omit<OutputScalarValue, 'key'> | undefined => {
  const type = OUTPUT_FIELD_TYPE_BY_CLIENT_TYPE[field.type]

  switch (field.type) {
    case 'number':
      return typeof raw === 'number' && Number.isFinite(raw)
        ? { type, numberValue: raw }
        : undefined
    case 'string':
    /* The date branch is unreached today -- no contract declares a date
     * output. Whoever adds the first one must check what actually arrives:
     * the client generates with `{ dates: true }` and `transformer: true`, so
     * a date-typed response field is converted to a Date before it gets here
     * and this check would silently omit it. */
    case 'date':
      return typeof raw === 'string' ? { type, stringValue: raw } : undefined
    case 'boolean':
      return typeof raw === 'boolean' ? { type, booleanValue: raw } : undefined
    default: {
      const unhandled: never = field.type
      return unhandled
    }
  }
}

const toRow = (
  itemFields: readonly CalculatorScalarOutputField[],
  row: unknown,
): OutputFieldValueRow => {
  const rowValues = entriesOf(row)
  const values: OutputScalarValue[] = []

  for (const itemField of itemFields) {
    const payload = toScalarPayload(itemField, rowValues.get(itemField.name))

    if (payload) {
      values.push({ key: itemField.name, ...payload })
    }
  }

  return { values }
}

export const toOutputValues = (
  outputFields: readonly CalculatorOutputField[],
  result: object,
): OutputFieldValue[] => {
  const resultValues = entriesOf(result)
  const values: OutputFieldValue[] = []

  for (const field of outputFields) {
    const raw = resultValues.get(field.name)

    if (field.kind === 'array') {
      /* An empty array is a result and is published as `[]`; a missing one is
       * a missing value and is omitted, like any absent scalar. */
      if (Array.isArray(raw)) {
        values.push({
          key: field.name,
          type: TaxCalculatorOutputFieldType.ARRAY,
          arrayValue: raw.map((row) => toRow(field.itemFields, row)),
        })
      }
      continue
    }

    const payload = toScalarPayload(field, raw)

    if (payload) {
      values.push({ key: field.name, ...payload })
    }
  }

  return values
}
