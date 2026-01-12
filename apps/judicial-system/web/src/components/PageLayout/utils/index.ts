import { IntlFormatters } from 'react-intl'

import {
  isCompletedCase,
  isInvestigationCase,
} from '@island.is/judicial-system/types'
import { sections as m } from '@island.is/judicial-system-web/messages'
import {
  Case,
  CaseDecision,
  CaseState,
  CaseType,
} from '@island.is/judicial-system-web/src/graphql/schema'

export const formatCaseResult = (
  formatMessage: IntlFormatters['formatMessage'],
  workingCase: Case,
  caseResult?: CaseState | null,
): string => {
  let caseType = workingCase.type

  if (caseResult === CaseState.REJECTED) {
    return formatMessage(m.caseResults.rejectedV2, {
      isInvestigationCase: isInvestigationCase(caseType),
    })
  } else if (caseResult === CaseState.ACCEPTED) {
    if (isInvestigationCase(caseType)) {
      return formatMessage(m.caseResults.investigationAccepted)
    } else {
      const isAlternativeTravelBan =
        workingCase.decision === CaseDecision.ACCEPTING_ALTERNATIVE_TRAVEL_BAN
      caseType = isAlternativeTravelBan ? CaseType.TRAVEL_BAN : caseType
      return workingCase.isValidToDateInThePast
        ? formatMessage(m.caseResults.restrictionOver, { caseType })
        : formatMessage(m.caseResults.restrictionActive, { caseType })
    }
  } else if (caseResult === CaseState.DISMISSED) {
    return formatMessage(m.caseResults.dissmissed)
  } else if (isCompletedCase(caseResult)) {
    return formatMessage(m.caseResults.indictmentClosed)
  } else {
    return formatMessage(m.caseResults.result)
  }
}
