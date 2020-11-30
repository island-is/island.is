import { Case } from '../models'

const fiveMinutes = 5 * 60 * 1000

export function transformCase(theCase: Case) {
  if (theCase.courtDate) {
    theCase.isCourtDateInThePast =
      Date.now() - fiveMinutes > new Date(theCase.courtDate).getTime()
  }

  return theCase
}
