import { getValueViaPath } from '@island.is/application/core'
import { ExternalData } from '@island.is/application/types'
import { IS_REGULATED_EXTERNAL_DATA_ID } from './constants'

// Whether the company may start the assessment, as reported by Fjarskiptastofa.
// `lookupFailed` is deliberately kept apart from `notEligible`: the isRegulated
// provider runs on entry to the prerequisites state and the create flow ignores
// its errors, so an X-Road outage or a timeout leaves the flags unset instead of
// false. Folding that into `notEligible` would tell an eligible company that it
// is not allowed to apply.
export type EligibilityState = 'eligible' | 'notEligible' | 'lookupFailed'

// Single source of truth for the eligibility check, shared by the prerequisites
// screen (which shows the matching alert) and canStartApplication (which guards
// the prerequisites -> draft transition), so the two can never drift apart.
export const getEligibilityState = (
  externalData: ExternalData,
): EligibilityState => {
  const status = getValueViaPath<string>(
    externalData,
    `${IS_REGULATED_EXTERNAL_DATA_ID}.status`,
  )
  const isSupervisedEntity = getValueViaPath<boolean>(
    externalData,
    `${IS_REGULATED_EXTERNAL_DATA_ID}.data.isSupervisedEntity`,
  )
  const accessWindowOpen = getValueViaPath<boolean>(
    externalData,
    `${IS_REGULATED_EXTERNAL_DATA_ID}.data.accessWindowOpen`,
  )

  // A failed lookup is stored as `{ status: 'failure', data: {} }`, so both
  // flags are missing rather than false. Only a successful lookup that actually
  // answered both flags can tell an eligible company from an ineligible one.
  if (
    status !== 'success' ||
    typeof isSupervisedEntity !== 'boolean' ||
    typeof accessWindowOpen !== 'boolean'
  ) {
    return 'lookupFailed'
  }

  return isSupervisedEntity && accessWindowOpen ? 'eligible' : 'notEligible'
}
