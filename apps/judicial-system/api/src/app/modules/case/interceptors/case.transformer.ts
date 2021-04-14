import { Case } from '../models'

const fiveMinutes = 5 * 60 * 1000

export function transformCase(theCase: Case): Case {
  theCase.sendRequestToDefender = theCase.sendRequestToDefender ?? false

  if (theCase.custodyEndDate) {
    theCase.isCustodyEndDateInThePast =
      Date.now() > new Date(theCase.custodyEndDate).getTime()
  }

  return theCase
}
