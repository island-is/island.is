import { Case } from '../models'

const threeDays = 3 * 24 * 60 * 60 * 1000
const sevenDays = 7 * 24 * 60 * 60 * 1000

export function transformCase(theCase: Case): Case {
  return {
    ...theCase,
    sendRequestToDefender: theCase.sendRequestToDefender ?? false,
    defenderIsSpokesperson: theCase.defenderIsSpokesperson ?? false,
    requestProsecutorOnlySession: theCase.requestProsecutorOnlySession ?? false,
    isClosedCourtHidden: theCase.isClosedCourtHidden ?? false,
    isHeightenedSecurityLevel: theCase.isHeightenedSecurityLevel ?? false,
    isMasked: theCase.isMasked ?? false,
    isValidToDateInThePast: theCase.validToDate
      ? Date.now() > new Date(theCase.validToDate).getTime()
      : theCase.isValidToDateInThePast,
    isAppealDeadlineExpired: theCase.rulingDate
      ? Date.now() >= new Date(theCase.rulingDate).getTime() + threeDays
      : false,
    isAppealGracePeriodExpired: theCase.rulingDate
      ? Date.now() >= new Date(theCase.rulingDate).getTime() + sevenDays
      : false,
  }
}
