import { Comparators } from '@island.is/application/types'

/**
 * Single source of truth mapping internal Comparators enum values to
 * SDF wire-format strings used in ClientCondition payloads.
 *
 * Both backend (condition-hint.ts) and frontend (evaluateClientCondition.ts)
 * MUST import from here — never hardcode comparator strings.
 */
export const SdfComparators: Record<Comparators, string> = {
  [Comparators.EQUALS]: 'eq',
  [Comparators.NOT_EQUAL]: 'neq',
  [Comparators.GT]: 'gt',
  [Comparators.GTE]: 'gte',
  [Comparators.LT]: 'lt',
  [Comparators.LTE]: 'lte',
  [Comparators.CONTAINS]: 'in',
  [Comparators.NOT_CONTAINS]: 'nin',
} as const

export type SdfComparatorValue =
  (typeof SdfComparators)[keyof typeof SdfComparators]

/**
 * Named exports for each comparator wire-format string.
 * Frontend code uses these instead of destructuring from the Record.
 */
export const SDF_CMP_EQUALS = SdfComparators[Comparators.EQUALS]
export const SDF_CMP_NOT_EQUAL = SdfComparators[Comparators.NOT_EQUAL]
export const SDF_CMP_GT = SdfComparators[Comparators.GT]
export const SDF_CMP_GTE = SdfComparators[Comparators.GTE]
export const SDF_CMP_LT = SdfComparators[Comparators.LT]
export const SDF_CMP_LTE = SdfComparators[Comparators.LTE]
export const SDF_CMP_CONTAINS = SdfComparators[Comparators.CONTAINS]
export const SDF_CMP_NOT_CONTAINS = SdfComparators[Comparators.NOT_CONTAINS]
