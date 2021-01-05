import { Case } from '../models'

const fiveMinutes = 5 * 60 * 1000

export function transformCase(theCase: Case) {
  theCase.alternativeTravelBan = theCase.alternativeTravelBan ?? false

  if (theCase.courtDate) {
    theCase.isCourtDateInThePast =
      Date.now() - fiveMinutes > new Date(theCase.courtDate).getTime()
  }

  if (theCase.custodyEndDate) {
    theCase.isCustodyEndDateInThePast =
      Date.now() > new Date(theCase.custodyEndDate).getTime()
  }

  return theCase
}
