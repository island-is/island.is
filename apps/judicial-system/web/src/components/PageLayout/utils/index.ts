import { IntlFormatters } from 'react-intl'

import {
  CaseDecision,
  CaseState,
  isIndictmentCase,
  isInvestigationCase,
} from '@island.is/judicial-system/types'
import { sections as m } from '@island.is/judicial-system-web/messages'
import { CaseType } from '@island.is/judicial-system-web/src/graphql/schema'
import { TempCase as Case } from '@island.is/judicial-system-web/src/types'

export const caseResult = (
  formatMessage: IntlFormatters['formatMessage'],
  workingCase: Case,
): string => {
  const isAccepted = workingCase.state === CaseState.ACCEPTED
  const isRejected = workingCase.state === CaseState.REJECTED
  const isDismissed = workingCase.state === CaseState.DISMISSED
  let caseType = workingCase.type

  if (isRejected) {
    return formatMessage(m.caseResults.rejectedV2, {
      isInvestigationCase: isInvestigationCase(caseType),
    })
  } else if (isAccepted) {
    if (isInvestigationCase(caseType)) {
      return formatMessage(m.caseResults.investigationAccepted)
    } else if (isIndictmentCase(caseType)) {
      return formatMessage(m.caseResults.indictmentClosed)
    } else {
      const isAlternativeTravelBan =
        workingCase.state === CaseState.ACCEPTED &&
        workingCase.decision === CaseDecision.ACCEPTING_ALTERNATIVE_TRAVEL_BAN
      caseType = isAlternativeTravelBan ? CaseType.TRAVEL_BAN : caseType
      return workingCase.isValidToDateInThePast
        ? formatMessage(m.caseResults.restrictionOver, { caseType })
        : formatMessage(m.caseResults.restrictionActive, { caseType })
    }
  } else if (isDismissed) {
    return formatMessage(m.caseResults.dissmissed)
  } else {
    return formatMessage(m.caseResults.result)
  }
}
