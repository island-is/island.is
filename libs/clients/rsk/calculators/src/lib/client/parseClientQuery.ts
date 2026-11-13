import type { CalculatorInput } from '../types/calculators'
import type { CalculatorKey } from './calculators.registry'
import { calculatorRegistry } from './calculators.registry'
import { invalidClientQueryFields } from './invalidClientQueryFields'

const isAccepted = <K extends CalculatorKey>(
  input: Readonly<Record<string, unknown>>,
  rejected: readonly string[],
): input is CalculatorInput<K> => rejected.length === 0

export const parseClientQuery = <K extends CalculatorKey>(
  key: K,
  input: Readonly<Record<string, unknown>>,
): { rejected: string[] } | { rejected?: never; query: CalculatorInput<K> } => {
  const rejected = invalidClientQueryFields(
    calculatorRegistry[key].query,
    input,
  )
  return isAccepted<K>(input, rejected) ? { query: input } : { rejected }
}
