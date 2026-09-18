import type { CalculatorFieldSemantic } from './field'

export type CalculatorOutputField =
  | CalculatorScalarOutputField
  | CalculatorArrayOutputField

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
