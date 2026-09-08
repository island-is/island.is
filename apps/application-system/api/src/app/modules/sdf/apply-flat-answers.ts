import cloneDeep from 'lodash/cloneDeep'
import set from 'lodash/set'

import { FormValue } from '@island.is/application/types'

/**
 * Merge the SDF client's answer payload onto an existing answer tree, expanding
 * dotted field ids into the nested shape the rest of the stack expects.
 *
 * The SDF client keys every answer by the field's literal id — including dotted
 * ids like `applicant.phoneNumber` (see ComponentSwitch/useFormActions). The
 * shared zod `dataSchema`, the legacy answer validators, and every downstream
 * reader (`getValueViaPath`, overview/DTO mappers) instead expect that value
 * nested under `applicant: { phoneNumber }` — the shape the legacy
 * react-hook-form renderer produced. A plain `{ ...base, ...client }` spread
 * left the typed value stranded under the flat key, so a required nested field
 * (e.g. the applicant phone number when no `userProfile` default exists)
 * validated as `undefined` → "Required".
 *
 * Using lodash `set` per key both nests the dotted ids and deep-merges into the
 * existing tree, so sibling fields already on `base.applicant` (name, email,
 * …) are preserved rather than clobbered by a shallow object replacement.
 *
 * Pure: returns a new tree, leaving `base` untouched.
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
    set(result, key, value)
  }

  return result as FormValue
}
