import type { IntlShape } from 'react-intl'

import {
  isIndictmentCase,
  isInvestigationCase,
} from '@island.is/judicial-system/types'
import type { WorkingCase } from '@island.is/judicial-system-web/src/components'
import {
  CaseDecision,
  CaseState,
  CaseType,
} from '@island.is/judicial-system-web/src/graphql/schema'

import { strings } from './titleForCase.strings'

export const titleForCase = (
  formatMessage: IntlShape['formatMessage'],
  theCase: WorkingCase,
) => {
  if (isIndictmentCase(theCase.type)) {
    return 'Máli lokið'
  }

  if (theCase.state === CaseState.REJECTED) {
    return isInvestigationCase(theCase.type)
      ? strings.investigationCaseRejectedTitle
      : strings.restrictionCaseRejectedTitle
  }

  if (theCase.state === CaseState.DISMISSED) {
    return strings.caseDismissedTitle
  }

  if (theCase.state === CaseState.ACCEPTED) {
    if (isInvestigationCase(theCase.type)) {
      return strings.investigationCaseAcceptedTitle
    }

    const caseType =
      theCase.decision === CaseDecision.ACCEPTING_ALTERNATIVE_TRAVEL_BAN
        ? CaseType.TRAVEL_BAN
        : theCase.type

    return theCase.isValidToDateInThePast
      ? formatMessage(
          {
            id: strings.restrictionCaseExpiredTitle,
            defaultMessage: strings.restrictionCaseExpiredTitle,
          },
          { caseType },
        )
      : formatMessage(
          {
            id: strings.restrictionCaseActiveTitle,
            defaultMessage: strings.restrictionCaseActiveTitle,
          },
          {
            caseType,
          },
        )
  }

  return isInvestigationCase(theCase.type)
    ? formatMessage(
        {
          id: strings.investigationCaseInProgressTitle,
          defaultMessage: strings.investigationCaseInProgressTitle,
        },
        {
          isExtended: Boolean(theCase.parentCase),
        },
      )
    : formatMessage(
        {
          id: strings.restrictionCaseInProgressTitle,
          defaultMessage: strings.restrictionCaseInProgressTitle,
        },
        {
          caseType: theCase.type,
          isExtended: Boolean(theCase.parentCase),
        },
      )
}
