import { IntlShape } from 'react-intl'

import {
  capitalize,
  formatCaseType,
} from '@island.is/judicial-system/formatters'
import { isIndictmentCase } from '@island.is/judicial-system/types'
import { core } from '@island.is/judicial-system-web/messages'
import {
  CaseDecision,
  CaseType,
} from '@island.is/judicial-system-web/src/graphql/schema'

export const displayCaseType = (
  formatMessage: IntlShape['formatMessage'],
  caseType?: CaseType | null,
  decision?: CaseDecision | null,
) => {
  if (decision === CaseDecision.ACCEPTING_ALTERNATIVE_TRAVEL_BAN) {
    return capitalize(formatCaseType(CaseType.TRAVEL_BAN))
  }

  const type = isIndictmentCase(caseType)
    ? formatMessage(core.indictment)
    : formatCaseType(caseType)

  return capitalize(type)
}
