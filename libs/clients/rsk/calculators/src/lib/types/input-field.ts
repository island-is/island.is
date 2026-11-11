import type { CalculatorFieldSemantic } from './semantic'

export type CalculatorFieldType =
  | 'number'
  | 'string'
  | 'boolean'
  | 'date'
  | 'select'

export interface CalculatorField {
  name: string
  type: CalculatorFieldType
  required: boolean
  semantic?: CalculatorFieldSemantic
  integer?: boolean
  minimum?: number
  maximum?: number
  defaultValue?: number
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
