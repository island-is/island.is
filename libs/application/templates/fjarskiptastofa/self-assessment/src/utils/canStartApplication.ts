import { ApplicationContext } from '@island.is/application/types'
import { getEligibilityState } from './eligibility'

// Guards the prerequisites -> draft transition on the backend. Only a company
// that Fjarskiptastofa reports as a supervised entity with an open access window
// may start the assessment. The isRegulated data provider stores both flags on
// entry to the prerequisites state; an ineligible company cannot transition even
// if the frontend submit check is bypassed. A failed lookup is not eligibility
// either, so it blocks here too - the prerequisites screen tells the two apart.
export const canStartApplication = (context: ApplicationContext): boolean =>
  getEligibilityState(context.application.externalData) === 'eligible'
