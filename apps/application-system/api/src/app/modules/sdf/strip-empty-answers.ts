import { FormValue } from '@island.is/application/types'

/**
 * Remove empty-string answer values so the persisted answer tree matches the
 * legacy (v1) application-system.
 *
 * In legacy, an optional field left empty is never written to `answers` (an
 * untouched react-hook-form input submits `undefined`), so downstream readers
 * see the key as absent. SDF inputs are controlled and persist the raw value,
 * and the server stores answers with a spread-merge
 * (`{ ...application.answers, ...answers }`) that never removes keys — so once a
 * field is cleared to `''` it sticks as `''` forever. Consumers (submit DTO
 * mappers, overview, notifications) then see `''` where legacy saw `undefined`,
 * which leaks empty values into outgoing payloads (e.g. an empty `postnumer`
 * that legacy would have omitted from the JSON entirely).
 *
 * Applied at the persistence boundary, this normalizes the canonical stored
 * answers to never carry empty strings, so every consumer behaves like legacy
 * without per-app glue. Only the empty-string leaves are dropped; the
 * surrounding structure (objects/arrays, including emptied parents) is left
 * intact, and no other "empty" shapes (`null`, `[]`) are touched — keeping the
 * change limited to the exact `'' -> absent` parity the legacy renderer had.
 *
 * Pure: returns a new tree, leaving the input untouched (callers reuse the
 * merged answers for validation and re-render).
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

/**
 * Convenience wrapper for the common case of normalizing a merged answers
 * object before it is persisted.
 */
export const stripEmptyFormValue = (answers: FormValue): FormValue =>
  stripEmptyAnswers(answers)
