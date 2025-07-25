import { IntlShape } from 'react-intl'

import { formatDate, formatDOB } from '@island.is/judicial-system/formatters'
import { isAcceptingCaseDecision } from '@island.is/judicial-system/types'
import {
  Case,
  CaseDecision,
  CaseType,
  Defendant,
} from '@island.is/judicial-system-web/src/graphql/schema'

import { strings } from './Ruling.strings'

export const getConclusionAutofill = (
  formatMessage: IntlShape['formatMessage'],
  workingCase: Case,
  decision: CaseDecision,
  defendant: Defendant,
  validToDate?: string | null,
  isCustodyIsolation?: boolean | null,
  isolationToDate?: string | null,
) => {
  const isolationEndsBeforeValidToDate =
    validToDate &&
    isolationToDate &&
    new Date(validToDate) > new Date(isolationToDate)

  const defendantDOB = formatDOB(
    defendant.nationalId,
    defendant.noNationalId,
    '',
  )

  return decision === CaseDecision.DISMISSING
    ? formatMessage(strings.sections.conclusion.dismissingAutofill, {
        defendantName: defendant.name,
        isExtended:
          workingCase.parentCase &&
          isAcceptingCaseDecision(workingCase.parentCase.decision),
        caseType: workingCase.type,
      })
    : decision === CaseDecision.REJECTING
    ? formatMessage(strings.sections.conclusion.rejectingAutofill, {
        defendantName: defendant.name,
        defendantDOB: defendantDOB ? `, ${defendantDOB}, ` : ', ',
        isExtended:
          workingCase.parentCase &&
          isAcceptingCaseDecision(workingCase.parentCase.decision),
        caseType: workingCase.type,
      })
    : formatMessage(strings.sections.conclusion.acceptingAutofill, {
        defendantName: defendant.name,
        defendantDOB: defendantDOB ? `, ${defendantDOB}, ` : ', ',
        isExtended:
          workingCase.parentCase &&
          isAcceptingCaseDecision(workingCase.parentCase.decision) &&
          decision !== CaseDecision.ACCEPTING_ALTERNATIVE_TRAVEL_BAN,
        caseType:
          decision === CaseDecision.ACCEPTING_ALTERNATIVE_TRAVEL_BAN
            ? CaseType.TRAVEL_BAN
            : workingCase.type,
        validToDate: `${formatDate(validToDate, 'PPPPp')
          ?.replace('dagur,', 'dagsins')
          ?.replace(' kl.', ', kl.')}`,
        hasIsolation: isAcceptingCaseDecision(decision) && isCustodyIsolation,
        isolationEndsBeforeValidToDate,
        isolationToDate: formatDate(isolationToDate, 'PPPPp')
          ?.replace('dagur,', 'dagsins')
          ?.replace(' kl.', ', kl.'),
      })
}
