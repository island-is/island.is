import { IntlShape } from 'react-intl'

import {
  CaseDecision,
  CaseState,
  CaseType,
  isInvestigationCase,
} from '@island.is/judicial-system/types'

import { TempCase as Case } from '@island.is/judicial-system-web/src/types'
import { strings } from './titleForCase.strings'

export const titleForCase = (
  formatMessage: IntlShape['formatMessage'],
  theCase: Case,
) => {
  const isTravelBan =
    theCase.decision === CaseDecision.ACCEPTING_ALTERNATIVE_TRAVEL_BAN ||
    theCase.type === CaseType.TRAVEL_BAN

  if (theCase.state === CaseState.REJECTED) {
    if (isInvestigationCase(theCase.type)) {
      return formatMessage(strings.investigationCaseRejected)
    } else {
      return formatMessage(strings.restrictionCaseRejected)
    }
  }

  if (theCase.state === CaseState.DISMISSED) {
    return formatMessage(strings.dismissedTitle)
  }

  if (theCase.isValidToDateInThePast) {
    return formatMessage(strings.validToDateInThePast, {
      caseType: isTravelBan ? CaseType.TRAVEL_BAN : theCase.type,
    })
  }

  return isInvestigationCase(theCase.type)
    ? formatMessage(strings.investigationAccepted)
    : formatMessage(strings.restrictionActive, {
        caseType: isTravelBan ? CaseType.TRAVEL_BAN : theCase.type,
      })
}
