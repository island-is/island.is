import type {
  CalculatorInputSection,
  CalculatorInputSectionField,
  CalculatorLocalizedMarkdown,
  CalculatorLocalizedText,
  CalculatorOutputItemField,
  CalculatorOutputSection,
  CalculatorOutputSectionField,
} from '@island.is/tax-calculators'

import type {
  GetTaxCalculatorFieldsForContentfulAppQuery,
  TaxCalculatorInputFieldSemantic,
  TaxCalculatorInputFieldType,
  TaxCalculatorOutputFieldSemantic,
  TaxCalculatorOutputFieldType,
} from '../../../graphql/schema'

/* `inputFields`, `outputFields` and `itemFields` are interface-typed, so codegen
 * emits a UNION of per-`__typename` shapes -- and `type` is the same
 * non-literal enum on every member, so it cannot discriminate. Only
 * `__typename` can. Reading `semantic`, `options` or `itemFields` straight off
 * these unions is a compile error on every member that lacks them.
 *
 * These aliases exist so the normalizers below are the only code that ever
 * touches the raw union. They are read off the generated operation, so widening
 * the query still widens what the normalizer sees. */
type RawInputField =
  GetTaxCalculatorFieldsForContentfulAppQuery['taxCalculator']['inputFields'][number]
type RawOutputField =
  GetTaxCalculatorFieldsForContentfulAppQuery['taxCalculator']['outputFields'][number]
type RawOutputItemField = Extract<
  RawOutputField,
  { __typename: 'TaxCalculatorArrayOutputField' }
>['itemFields'][number]

/* Flat editor view models. `options` collapses `{ value }[]` to `string[]`, and
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
 * gets flagged instead of silently looking like an unselected row. */
export type InputFieldContract = Map<string, InputContractField>
export type OutputFieldContract = Map<string, OutputContractField>

/* `avoidOptionals: { object: true }` applies to the schema types, not to
 * operation selections, so the generated `semantic` is `X | null | undefined`.
 * Collapse null to undefined here so `'semantic' in field` style checks are not
 * misleading downstream. */
const orUndefined = <T,>(value: T | null | undefined): T | undefined =>
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

/* The ONLY place that switches on `__typename`, closed with a `never` guard --
 * the same pattern the domain's own `resolveType` uses. A sixth field type
 * added to the API fails to compile here, rather than silently falling through
 * unmatched `__typename` checks spread across row components. */
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
      return { ...base, itemFields: field.itemFields.map(toOutputContractItemField) }
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

export interface InputSectionActions {
  update: (patch: Partial<CalculatorInputSection>) => void
  remove: () => void
  addField: () => void
  updateField: (
    fieldIndex: number,
    patch: Partial<CalculatorInputSectionField>,
  ) => void
  removeField: (fieldIndex: number) => void
  enableToggle: () => void
  disableToggle: () => void
  setGate: (toggleKey: string) => void
  setToggleLabel: (label: CalculatorLocalizedText | undefined) => void
  toggleGateDisableOnly: () => void
}

export interface OutputSectionActions {
  update: (patch: Partial<CalculatorOutputSection>) => void
  setContent: (content: CalculatorLocalizedMarkdown | undefined) => void
  remove: () => void
  addField: () => void
  updateField: (
    fieldIndex: number,
    patch: Partial<CalculatorOutputSectionField>,
  ) => void
  removeField: (fieldIndex: number) => void
  addItemField: (fieldIndex: number) => void
  addAllItemFields: (fieldIndex: number, keys: OutputContractItemField[]) => void
  updateItemField: (
    fieldIndex: number,
    itemIndex: number,
    patch: Partial<CalculatorOutputItemField>,
  ) => void
  removeItemField: (fieldIndex: number, itemIndex: number) => void
}
