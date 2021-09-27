import { Case } from '../models'

const threeDays = 3 * 24 * 60 * 60 * 1000
const sevenDays = 7 * 24 * 60 * 60 * 1000

export function transformCase(theCase: Case): Case {
  theCase.sendRequestToDefender = theCase.sendRequestToDefender ?? false
  theCase.defenderIsSpokesperson = theCase.defenderIsSpokesperson ?? false
  theCase.requestProsecutorOnlySession =
    theCase.requestProsecutorOnlySession ?? false
  theCase.isClosedCourtHidden = theCase.isClosedCourtHidden ?? false
  theCase.isAccusedRightsHidden = theCase.isAccusedRightsHidden ?? false

  if (theCase.validToDate) {
    theCase.isValidToDateInThePast =
      Date.now() > new Date(theCase.validToDate).getTime()
  }

  theCase.isAppealDeadlineExpired = theCase.rulingDate
    ? Date.now() >= new Date(theCase.rulingDate).getTime() + threeDays
    : false

  theCase.isAppealGracePeriodExpired = theCase.rulingDate
    ? Date.now() >= new Date(theCase.rulingDate).getTime() + sevenDays
    : false

  return theCase
}
