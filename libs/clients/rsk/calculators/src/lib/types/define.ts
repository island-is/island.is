import type { CalculatorContract } from './calculator'
import type { CalculatorField } from './input-field'
import type { CalculatorOutputField } from './output-field'

export const defineInputFields = <T extends readonly CalculatorField[]>(
  fields: T,
): T => fields

export const defineOutputFields = <T extends readonly CalculatorOutputField[]>(
  fields: T,
): T => fields

export const defineCalculator = <T extends CalculatorContract>(
  contract: T,
): T => contract
