import type {
  GetTaxCalculatorQuery,
  TaxCalculatorInputFieldSemantic,
  TaxCalculatorInputFieldType,
  TaxCalculatorOutputFieldSemantic,
  TaxCalculatorOutputFieldType,
} from '@island.is/web/graphql/schema'

type RawInputField =
  GetTaxCalculatorQuery['taxCalculator']['inputFields'][number]
type RawOutputField =
  GetTaxCalculatorQuery['taxCalculator']['outputFields'][number]

/* Flat view models. `options` collapses `{ value }[]` to `string[]`, and
 * `dependsOn.equals` collapses the aliased scalar union to one value. */
export interface InputContractField {
  key: string
  type: TaxCalculatorInputFieldType
  semantic?: TaxCalculatorInputFieldSemantic
  options?: string[]
  required: boolean
  dependsOn?: {
    fieldKey: string
    equals: string | number | boolean
  }
}

export interface OutputContractItemField {
  key: string
  type: TaxCalculatorOutputFieldType
  semantic?: TaxCalculatorOutputFieldSemantic
}

export interface OutputContractField {
  key: string
  type: TaxCalculatorOutputFieldType
  semantic?: TaxCalculatorOutputFieldSemantic
  itemFields?: OutputContractItemField[]
}

/* Keyed by field key. A map rather than the array the query returns, because
 * every row looks up the one field its `key` points at -- and needs to know
 * when that lookup misses, which is how a key the backend no longer returns
 * gets flagged instead of silently rendering nothing. */
export type InputFieldContract = Map<string, InputContractField>
export type OutputFieldContract = Map<string, OutputContractField>

const normalizeDependency = (dependsOn: RawInputField['dependsOn']) => {
  if (!dependsOn) return undefined

  const { equals } = dependsOn
  switch (equals.__typename) {
    case 'TaxCalculatorBooleanInputDependencyValue':
      return { fieldKey: dependsOn.fieldKey, equals: equals.booleanValue }
    case 'TaxCalculatorStringInputDependencyValue':
      return { fieldKey: dependsOn.fieldKey, equals: equals.stringValue }
    case 'TaxCalculatorNumberInputDependencyValue':
      return { fieldKey: dependsOn.fieldKey, equals: equals.numberValue }
    default: {
      const unhandled: never = equals
      return unhandled
    }
  }
}

export const toInputContractField = (
  field: RawInputField,
): InputContractField => {
  const base = {
    key: field.key,
    type: field.type,
    required: field.required,
    dependsOn: normalizeDependency(field.dependsOn),
  }

  switch (field.__typename) {
    case 'TaxCalculatorNumberInputField':
      return { ...base, semantic: field.semantic ?? undefined }
    case 'TaxCalculatorSelectInputField':
      return { ...base, options: field.options.map((option) => option.value) }
    case 'TaxCalculatorStringInputField':
    case 'TaxCalculatorBooleanInputField':
    case 'TaxCalculatorDateInputField':
      return base
    default: {
      const unhandled: never = field
      return unhandled
    }
  }
}

export const toOutputContractField = (
  field: RawOutputField,
): OutputContractField => {
  const base = { key: field.key, type: field.type }

  switch (field.__typename) {
    case 'TaxCalculatorNumberOutputField':
      return { ...base, semantic: field.semantic ?? undefined }
    case 'TaxCalculatorArrayOutputField':
      return {
        ...base,
        itemFields: field.itemFields.map((itemField) => {
          const itemBase = { key: itemField.key, type: itemField.type }

          switch (itemField.__typename) {
            case 'TaxCalculatorNumberOutputField':
              return {
                ...itemBase,
                semantic: itemField.semantic ?? undefined,
              }
            case 'TaxCalculatorStringOutputField':
            case 'TaxCalculatorBooleanOutputField':
            case 'TaxCalculatorDateOutputField':
              return itemBase
            default: {
              const unhandled: never = itemField
              return unhandled
            }
          }
        }),
      }
    case 'TaxCalculatorStringOutputField':
    case 'TaxCalculatorBooleanOutputField':
    case 'TaxCalculatorDateOutputField':
      return base
    default: {
      const unhandled: never = field
      return unhandled
    }
  }
}

export const toInputFieldContract = (
  fields: readonly RawInputField[],
): InputFieldContract =>
  new Map(
    fields.map((field) => {
      const contractField = toInputContractField(field)
      return [contractField.key, contractField]
    }),
  )

export const toOutputFieldContract = (
  fields: readonly RawOutputField[],
): OutputFieldContract =>
  new Map(
    fields.map((field) => {
      const contractField = toOutputContractField(field)
      return [contractField.key, contractField]
    }),
  )
