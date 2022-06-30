import {
  Case,
  CaseDecision,
  CaseState,
  CaseType,
  isInvestigationCase,
} from '@island.is/judicial-system/types'
import { IntlFormatters } from 'react-intl'

import { sections as m } from '@island.is/judicial-system-web/messages'

export const caseResult = (
  formatMessage: IntlFormatters['formatMessage'],
  workingCase?: Case,
): string => {
  if (!workingCase) {
    return ''
  }

  const isAccepted =
    workingCase.state === CaseState.ACCEPTED ||
    workingCase?.parentCase?.state === CaseState.ACCEPTED

  /**
   * No need to check the parent case state because you can't extend a
   * travel ban cases, dissmissed or rejected cases
   */
  const isRejected = workingCase?.state === CaseState.REJECTED
  const isDismissed = workingCase.state === CaseState.DISMISSED

  let caseType = workingCase.type
  if (isRejected) {
    return formatMessage(m.caseResults.rejected, {
      isInvestigationCase: isInvestigationCase(caseType) ? 'yes' : 'no',
    })
  } else if (isAccepted) {
    if (isInvestigationCase(caseType)) {
      return formatMessage(m.caseResults.investigationAccepted)
    } else {
      const isAlternativeTravelBan =
        workingCase.state === CaseState.ACCEPTED &&
        workingCase.decision === CaseDecision.ACCEPTING_ALTERNATIVE_TRAVEL_BAN
      caseType = isAlternativeTravelBan ? CaseType.TRAVEL_BAN : caseType
      return workingCase?.isValidToDateInThePast
        ? formatMessage(m.caseResults.restrictionOver, { caseType })
        : formatMessage(m.caseResults.restrictionActive, { caseType })
    }
  } else if (isDismissed) {
    return formatMessage(m.caseResults.dissmissed)
  } else {
    return formatMessage(m.caseResults.result)
  }
}
