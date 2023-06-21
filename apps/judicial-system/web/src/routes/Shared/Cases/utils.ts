import compareAsc from 'date-fns/compareAsc'
import { IntlShape } from 'react-intl'

import {
  CaseAppealDecision,
  CaseDecision,
  isIndictmentCase,
} from '@island.is/judicial-system/types'
import { core } from '@island.is/judicial-system-web/messages'
import { capitalize, caseTypes } from '@island.is/judicial-system/formatters'
import { CaseType } from '@island.is/judicial-system-web/src/graphql/schema'

export const displayCaseType = (
  formatMessage: IntlShape['formatMessage'],
  caseType: CaseType,
  decision?: CaseDecision,
) => {
  if (decision === CaseDecision.ACCEPTING_ALTERNATIVE_TRAVEL_BAN) {
    return capitalize(caseTypes[CaseType.TRAVEL_BAN])
  }

  const type = isIndictmentCase(caseType)
    ? formatMessage(core.indictment)
    : caseTypes[caseType]

  return capitalize(type)
}

export const getAppealDate = (
  prosecutorAppealDecision: CaseAppealDecision,
  accusedAppealDecision: CaseAppealDecision,
  prosecutorPostponedAppealDate: string,
  accusedPostponedAppealDate: string,
  courtEndTime: string,
) => {
  if (
    prosecutorAppealDecision === CaseAppealDecision.APPEAL ||
    accusedAppealDecision === CaseAppealDecision.APPEAL
  ) {
    return courtEndTime
  } else if (accusedPostponedAppealDate && !prosecutorPostponedAppealDate) {
    return accusedPostponedAppealDate
  } else if (prosecutorPostponedAppealDate && !accusedPostponedAppealDate) {
    return prosecutorPostponedAppealDate
  } else {
    const compareDates = compareAsc(
      new Date(prosecutorPostponedAppealDate),
      new Date(accusedPostponedAppealDate),
    )

    return compareDates === 1
      ? accusedPostponedAppealDate
      : prosecutorPostponedAppealDate
  }
}
