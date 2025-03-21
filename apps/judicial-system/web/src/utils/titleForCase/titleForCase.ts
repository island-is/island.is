import { IntlShape } from 'react-intl'

import { isInvestigationCase } from '@island.is/judicial-system/types'
import {
  Case,
  CaseDecision,
  CaseState,
  CaseType,
} from '@island.is/judicial-system-web/src/graphql/schema'

import { strings } from './titleForCase.strings'

export const titleForCase = (
  formatMessage: IntlShape['formatMessage'],
  theCase: Case,
) => {
  if (theCase.state === CaseState.REJECTED) {
    return isInvestigationCase(theCase.type)
      ? formatMessage(strings.investigationCaseRejectedTitle)
      : formatMessage(strings.restrictionCaseRejectedTitle)
  }

  if (theCase.state === CaseState.DISMISSED) {
    return formatMessage(strings.caseDismissedTitle)
  }

  if (theCase.state === CaseState.ACCEPTED) {
    if (isInvestigationCase(theCase.type)) {
      return formatMessage(strings.investigationCaseAcceptedTitle)
    }

    const caseType =
      theCase.decision === CaseDecision.ACCEPTING_ALTERNATIVE_TRAVEL_BAN
        ? CaseType.TRAVEL_BAN
        : theCase.type

    return theCase.isValidToDateInThePast
      ? formatMessage(strings.restrictionCaseExpiredTitle, { caseType })
      : formatMessage(strings.restrictionCaseActiveTitle, {
          caseType,
        })
  }

  return isInvestigationCase(theCase.type)
    ? formatMessage(strings.investigationCaseInProgressTitle, {
        isExtended: Boolean(theCase.parentCase),
      })
    : formatMessage(strings.restrictionCaseInProgressTitle, {
        caseType: theCase.type,
        isExtended: Boolean(theCase.parentCase),
      })
}
