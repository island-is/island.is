import {
  getAppealInfo,
  useAppealValidToDates,
} from '@island.is/judicial-system/types'

import { Case } from '../models/case.model'

const getDays = (days: number) => days * 24 * 60 * 60 * 1000

export function transformCase(theCase: Case): Case {
  const appealInfo = getAppealInfo(theCase)

  return {
    ...theCase,
    requestProsecutorOnlySession: theCase.requestProsecutorOnlySession ?? false,
    isClosedCourtHidden: theCase.isClosedCourtHidden ?? false,
    isHeightenedSecurityLevel: theCase.isHeightenedSecurityLevel ?? false,
    isValidToDateInThePast:
      useAppealValidToDates(
        theCase.decision,
        theCase.state,
        theCase.appealRulingDecision,
        theCase.appealState,
      ) && theCase.appealValidToDate
        ? Date.now() > new Date(theCase.appealValidToDate).getTime()
        : theCase.validToDate
        ? Date.now() > new Date(theCase.validToDate).getTime()
        : theCase.isValidToDateInThePast,

    // TODO: Move remaining appeal fields to appealInfo
    isAppealDeadlineExpired: appealInfo.appealDeadline
      ? Date.now() >= new Date(appealInfo.appealDeadline).getTime()
      : false,
    isAppealGracePeriodExpired: theCase.rulingDate
      ? Date.now() >= new Date(theCase.rulingDate).getTime() + getDays(31)
      : false,
    isStatementDeadlineExpired: theCase.appealReceivedByCourtDate
      ? Date.now() >=
        new Date(theCase.appealReceivedByCourtDate).getTime() + getDays(1)
      : false,
    ...appealInfo,
  }
}
