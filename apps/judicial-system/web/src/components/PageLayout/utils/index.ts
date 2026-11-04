import type { IntlFormatters } from 'react-intl'

import {
  isCompletedCase,
  isInvestigationCase,
} from '@island.is/judicial-system/types'
import { sections as m } from '@island.is/judicial-system-web/messages'
import type { WorkingCase } from '@island.is/judicial-system-web/src/components'
import {
  CaseDecision,
  CaseState,
  CaseType,
} from '@island.is/judicial-system-web/src/graphql/schema'

export const formatCaseResult = (
  formatMessage: IntlFormatters['formatMessage'],
  workingCase: WorkingCase,
  caseResult?: CaseState | null,
): string => {
  let caseType = workingCase.type

  if (caseResult === CaseState.REJECTED) {
    return formatMessage(
      {
        id: m.caseResults.rejectedV2,
        defaultMessage: m.caseResults.rejectedV2,
      },
      {
        isInvestigationCase: isInvestigationCase(caseType),
      },
    )
  } else if (caseResult === CaseState.ACCEPTED) {
    if (isInvestigationCase(caseType)) {
      return m.caseResults.investigationAccepted
    } else {
      const isAlternativeTravelBan =
        workingCase.decision === CaseDecision.ACCEPTING_ALTERNATIVE_TRAVEL_BAN
      caseType = isAlternativeTravelBan ? CaseType.TRAVEL_BAN : caseType
      return workingCase.isValidToDateInThePast
        ? formatMessage(
            {
              id: m.caseResults.restrictionOver,
              defaultMessage: m.caseResults.restrictionOver,
            },
            { caseType },
          )
        : formatMessage(
            {
              id: m.caseResults.restrictionActive,
              defaultMessage: m.caseResults.restrictionActive,
            },
            { caseType },
          )
    }
  } else if (caseResult === CaseState.DISMISSED) {
    return m.caseResults.dissmissed
  } else if (isCompletedCase(caseResult)) {
    return m.caseResults.indictmentClosed
  } else {
    return m.caseResults.result
  }
}
