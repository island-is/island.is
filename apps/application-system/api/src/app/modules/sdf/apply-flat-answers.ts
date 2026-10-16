import cloneDeep from 'lodash/cloneDeep'
import set from 'lodash/set'

import { FormValue } from '@island.is/application/types'

/**
 * Apply the SDF client's answer payload onto an existing answer tree, expanding
 * dotted field ids into the nested shape the rest of the stack expects.
 *
 * The SDF client keys every answer by the field's literal id — including dotted
 * ids like `applicant.phoneNumber` (see ComponentSwitch/useFormActions). The
 * shared zod `dataSchema`, the legacy answer validators, and every downstream
 * reader (`getValueViaPath`, overview/DTO mappers) instead expect that value
 * nested under `applicant: { phoneNumber }` — the shape the legacy
 * react-hook-form renderer produced. Leaving a dotted value under its flat key
 * would make a required nested field (e.g. the applicant phone number) read as
 * `undefined` and fail validation as required.
 *
 * Using lodash `set` per key nests the dotted ids into the existing tree, so
 * sibling fields already on `base.applicant` (name, email, …) are preserved
 * when only `applicant.phoneNumber` is sent.
 *
 * A value that is an object or an array replaces whatever is stored under its
 * key; it is not deep-merged. A field owns its whole value, so a field that
 * sends an object or array must send the complete value. Keys are applied in
 * order, so a later key overwrites anything an earlier key wrote at or below
 * the same path.
 *
 * Pure: returns a new tree, leaving `base` and `flatAnswers` untouched.
 * Incoming values are cloned, so the result shares no objects with either.
 */
export const applyFlatAnswers = (
  base: FormValue | undefined,
  flatAnswers: Record<string, unknown> | undefined,
): FormValue => {
  const result = cloneDeep(base ?? {}) as Record<string, unknown>
  if (!flatAnswers) {
    return result as FormValue
  }

  for (const [key, value] of Object.entries(flatAnswers)) {
    set(result, key, cloneDeep(value))
  }

  return result as FormValue
}
