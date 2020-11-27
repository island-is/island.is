import { Case } from '../models'

export function transformCase(theCase: Case) {
  if (theCase.courtDate) {
    theCase.isCourtDateInThePast =
      Date.now() - 5000 > new Date(theCase.courtDate).getTime()
  }

  return theCase
}
