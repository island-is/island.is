import type {
  GetTaxCalculatorQuery,
  TaxCalculatorInputFieldSemantic,
  TaxCalculatorInputFieldType,
  TaxCalculatorOutputFieldSemantic,
  TaxCalculatorOutputFieldType,
} from '@island.is/web/graphql/schema'

/* Isolates codegen's interface unions in the normalizers below. */
export type RawInputField =
  GetTaxCalculatorQuery['taxCalculator']['inputFields'][number]
export type RawOutputField =
  GetTaxCalculatorQuery['taxCalculator']['outputFields'][number]
type RawOutputItemField = Extract<
  RawOutputField,
  { __typename: 'TaxCalculatorArrayOutputField' }
>['itemFields'][number]

/* Flattens GraphQL fields for rendering. */
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

/* Supports metadata lookups and stale-key detection. */
export type InputFieldContract = Map<string, InputContractField>
export type OutputFieldContract = Map<string, OutputContractField>

/* Normalizes nullable operation fields to undefined. */
const orUndefined = <T>(value: T | null | undefined): T | undefined =>
  value ?? undefined

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

/* Exhaustively normalizes GraphQL input variants. */
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
      return { ...base, semantic: orUndefined(field.semantic) }
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

const toOutputContractItemField = (
  field: RawOutputItemField,
): OutputContractItemField => {
  const base = { key: field.key, type: field.type }

  switch (field.__typename) {
    case 'TaxCalculatorNumberOutputField':
      return { ...base, semantic: orUndefined(field.semantic) }
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

export const toOutputContractField = (
  field: RawOutputField,
): OutputContractField => {
  const base = { key: field.key, type: field.type }

  switch (field.__typename) {
    case 'TaxCalculatorNumberOutputField':
      return { ...base, semantic: orUndefined(field.semantic) }
    case 'TaxCalculatorArrayOutputField':
      return {
        ...base,
        itemFields: field.itemFields.map(toOutputContractItemField),
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
