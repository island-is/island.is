import {
  SDF_CMP_EQUALS,
  SDF_CMP_NOT_EQUAL,
  SDF_CMP_GT,
  SDF_CMP_GTE,
  SDF_CMP_LT,
  SDF_CMP_LTE,
  SDF_CMP_CONTAINS,
  SDF_CMP_NOT_CONTAINS,
} from '@island.is/application/sdf-types'

/**
 * Lightweight declarative condition evaluator for the SDF frontend.
 *
 * Evaluates ClientCondition hints emitted by the backend for Tier 1 (simple)
 * and Tier 2 (multi) conditions. This runs synchronously on every field change
 * within a page — no network round-trip needed.
 *
 * All comparator strings reference SdfComparators from @island.is/application/sdf-types
 * to guarantee parity with the backend (§8, Constraint 12).
 */

interface SingleCheck {
  questionId: string
  comparator: string
  value: string
}

interface MultiCheck {
  on: 'ALL' | 'ANY'
  checks: SingleCheck[]
}

type ClientCondition = SingleCheck | MultiCheck

function isMultiCheck(
  condition: ClientCondition,
): condition is MultiCheck {
  return 'checks' in condition && Array.isArray(condition.checks)
}

export function evaluateClientCondition(
  condition: ClientCondition | null | undefined,
  answers: Record<string, unknown>,
): boolean {
  if (!condition) return true

  if (isMultiCheck(condition)) {
    const results = condition.checks.map((c) => evaluateSingle(c, answers))
    return condition.on === 'ALL'
      ? results.every(Boolean)
      : results.some(Boolean)
  }

  return evaluateSingle(condition, answers)
}

function evaluateSingle(
  check: SingleCheck,
  answers: Record<string, unknown>,
): boolean {
  const actual = answers[check.questionId]
  const expected = check.value

  switch (check.comparator) {
    case SDF_CMP_EQUALS:
      return String(actual) === expected
    case SDF_CMP_NOT_EQUAL:
      return String(actual) !== expected
    case SDF_CMP_GT:
      return Number(actual) > Number(expected)
    case SDF_CMP_GTE:
      return Number(actual) >= Number(expected)
    case SDF_CMP_LT:
      return Number(actual) < Number(expected)
    case SDF_CMP_LTE:
      return Number(actual) <= Number(expected)
    case SDF_CMP_CONTAINS:
      return Array.isArray(actual) && actual.includes(expected)
    case SDF_CMP_NOT_CONTAINS:
      return Array.isArray(actual) && !actual.includes(expected)
    default:
      return true
  }
}
