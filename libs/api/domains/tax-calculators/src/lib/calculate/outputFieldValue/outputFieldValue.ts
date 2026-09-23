import type {
  CalculatorOutputField,
  CalculatorScalarOutputField,
} from '@island.is/clients/rsk/calculators'

import { TaxCalculatorOutputFieldType } from '../../models/enums'
import type { OutputFieldValue } from '../../models/outputFieldValue.model'
import type { OutputFieldValueRow } from '../../models/outputFieldValueRow.model'
import type { OutputScalarValue } from '../../models/outputScalarValue.model'
import { OUTPUT_FIELD_TYPE_BY_CLIENT_TYPE } from '../../fields/outputField/outputField'

/* Omit values not declared by the output contract. */
const entriesOf = (value: unknown): Map<string, unknown> =>
  typeof value === 'object' && value !== null
    ? new Map(Object.entries(value))
    : new Map()

/* Each branch produces exactly one payload. */
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
      /* Empty arrays publish as `[]`; absent values are omitted. */
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
