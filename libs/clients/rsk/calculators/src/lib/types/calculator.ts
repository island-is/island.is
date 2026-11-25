import type { CalculatorField } from './input-field'
import type { CalculatorOutputField } from './output-field'

export interface CalculatorContract<TKey extends string = string> {
  key: TKey
  inputFields: readonly CalculatorField[]
  outputFields: readonly CalculatorOutputField[]
}
