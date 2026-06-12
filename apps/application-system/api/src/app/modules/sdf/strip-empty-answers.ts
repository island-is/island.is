import { FormValue } from '@island.is/application/types'

/**
 * Drop empty-string answer leaves so the persisted tree matches legacy, where an
 * untouched optional field is absent rather than `''`. SDF inputs are controlled
 * and the spread-merge never removes keys, so a cleared field would otherwise
 * stick as `''` and leak into outgoing payloads. Only empty-string leaves are
 * dropped; structure and other "empty" shapes (`null`, `[]`) are left intact.
 *
 * Pure: returns a new tree, leaving the input untouched.
 */
export const stripEmptyAnswers = <T>(value: T): T => {
  if (Array.isArray(value)) {
    return value.map((item) => stripEmptyAnswers(item)) as unknown as T
  }

  if (value !== null && typeof value === 'object') {
    const result: Record<string, unknown> = {}
    for (const [key, child] of Object.entries(value)) {
      if (typeof child === 'string' && child.trim() === '') {
        continue
      }
      result[key] = stripEmptyAnswers(child)
    }
    return result as unknown as T
  }

  return value
}

/** Normalizes a merged answers object before it is persisted. */
export const stripEmptyFormValue = (answers: FormValue): FormValue =>
  stripEmptyAnswers(answers)
