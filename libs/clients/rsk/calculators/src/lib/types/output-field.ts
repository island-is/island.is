import type { CalculatorFieldSemantic } from './semantic'

export type CalculatorOutputField =
  | CalculatorScalarOutputField
  | CalculatorArrayOutputField
  | CalculatorObjectOutputField

export type CalculatorOutputScalarType =
  | 'number'
  | 'string'
  | 'boolean'
  | 'date'

export interface CalculatorScalarOutputField {
  name: string
  kind: 'scalar'
  type: CalculatorOutputScalarType
  semantic?: CalculatorFieldSemantic
}

export interface CalculatorArrayOutputField {
  name: string
  kind: 'array'
  itemFields: readonly CalculatorScalarOutputField[]
}

export interface CalculatorObjectOutputField {
  name: string
  kind: 'object'
  itemFields: readonly CalculatorScalarOutputField[]
}
