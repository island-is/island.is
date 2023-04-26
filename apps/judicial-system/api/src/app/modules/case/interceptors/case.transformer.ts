import { getAppealInfo } from '@island.is/judicial-system/types'
import { Case } from '../models/case.model'

const getDays = (days: number) => days * 24 * 60 * 60 * 1000

export function transformCase(theCase: Case): Case {
  const appealInfo = getAppealInfo(theCase)

  return {
    ...theCase,
    sendRequestToDefender: theCase.sendRequestToDefender ?? false,
    requestProsecutorOnlySession: theCase.requestProsecutorOnlySession ?? false,
    isClosedCourtHidden: theCase.isClosedCourtHidden ?? false,
    isHeightenedSecurityLevel: theCase.isHeightenedSecurityLevel ?? false,
    isValidToDateInThePast: theCase.validToDate
      ? Date.now() > new Date(theCase.validToDate).getTime()
      : theCase.isValidToDateInThePast,
    // TODO: Use appealInfo.appealDeadline
    isAppealDeadlineExpired: theCase.courtEndTime
      ? Date.now() >= new Date(theCase.courtEndTime).getTime() + getDays(3)
      : false,
    isAppealGracePeriodExpired: theCase.courtEndTime
      ? Date.now() >= new Date(theCase.courtEndTime).getTime() + getDays(31)
      : false,
    isStatementDeadlineExpired: theCase.appealReceivedByCourtDate
      ? Date.now() >=
        new Date(theCase.appealReceivedByCourtDate).getTime() + getDays(1)
      : false,
    ...appealInfo,
  }
}
