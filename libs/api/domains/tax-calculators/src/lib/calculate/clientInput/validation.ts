import type { SubmittedValues } from '../submission/submission'
import { missing, mistyped } from './errors'

export const numberAt = (
  values: SubmittedValues,
  key: string,
): number | undefined => {
  const value = values[key]

  if (value === undefined) {
    return undefined
  }

  return typeof value === 'number' ? value : mistyped(key, 'number')
}

export const stringAt = (
  values: SubmittedValues,
  key: string,
): string | undefined => {
  const value = values[key]

  if (value === undefined) {
    return undefined
  }

  return typeof value === 'string' ? value : mistyped(key, 'string')
}

export const booleanAt = (
  values: SubmittedValues,
  key: string,
): boolean | undefined => {
  const value = values[key]

  if (value === undefined) {
    return undefined
  }

  return typeof value === 'boolean' ? value : mistyped(key, 'boolean')
}

/* Preserves the permitted literal union after option lookup. */
export const optionAt = <T extends string>(
  values: SubmittedValues,
  key: string,
  permitted: readonly T[],
): T | undefined => {
  const value = stringAt(values, key)

  if (value === undefined) {
    return undefined
  }

  const match = permitted.find((option) => option === value)

  return match ?? mistyped(key, `permitted option (${permitted.join(', ')})`)
}

export const requireNumberAt = (values: SubmittedValues, key: string): number =>
  numberAt(values, key) ?? missing(key)

export const requireStringAt = (values: SubmittedValues, key: string): string =>
  stringAt(values, key) ?? missing(key)

export const requireBooleanAt = (
  values: SubmittedValues,
  key: string,
): boolean => booleanAt(values, key) ?? missing(key)

export const requireOptionAt = <T extends string>(
  values: SubmittedValues,
  key: string,
  permitted: readonly T[],
): T => optionAt(values, key, permitted) ?? missing(key)
