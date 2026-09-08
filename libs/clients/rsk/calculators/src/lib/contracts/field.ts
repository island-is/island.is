export interface CalculatorContract<TKey extends string = string> {
  key: TKey
  fields: readonly CalculatorField[]
}

export type CalculatorFieldType =
  | 'number'
  | 'string'
  | 'boolean'
  | 'date'
  | 'select'

export type CalculatorFieldSemantic =
  | 'currency'
  | 'percentage'
  | 'year'
  | 'month'
  | 'count'

export interface CalculatorField {
  name: string
  type: CalculatorFieldType
  required: boolean
  semantic?: CalculatorFieldSemantic
  options?: readonly CalculatorFieldOption[]
  dependsOn?: CalculatorFieldDependency
}

export interface CalculatorFieldOption {
  value: string
}

export interface CalculatorFieldDependency {
  field: string
  equals: string | number | boolean
}
