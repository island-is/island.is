import { CaseAppealDecision } from '@island.is/judicial-system/types'
import { Case } from '../models'

const threeDays = 3 * 24 * 60 * 60 * 1000

export function transformCase(theCase: Case): Case {
  theCase.sendRequestToDefender = theCase.sendRequestToDefender ?? false

  if (theCase.custodyEndDate) {
    theCase.isCustodyEndDateInThePast =
      Date.now() > new Date(theCase.custodyEndDate).getTime()
  }

  if (theCase.rulingDate) {
    theCase.isCaseAppealable =
      (theCase.accusedAppealDecision === CaseAppealDecision.POSTPONE ||
        theCase.prosecutorAppealDecision === CaseAppealDecision.POSTPONE) &&
      Date.now() < new Date(theCase.rulingDate).getTime() + threeDays
  }

  return theCase
}
