import compareAsc from 'date-fns/compareAsc'
import { IntlShape } from 'react-intl'

import { TagVariant } from '@island.is/island-ui/core'
import {
  CaseAppealDecision,
  CaseDecision,
  CaseState,
  isIndictmentCase,
  isInvestigationCase,
} from '@island.is/judicial-system/types'
import { core } from '@island.is/judicial-system-web/messages'
import { capitalize, caseTypes } from '@island.is/judicial-system/formatters'
import { CaseType } from '@island.is/judicial-system-web/src/graphql/schema'

import { cases as m } from './Cases.strings'

export const displayCaseType = (
  formatMessage: IntlShape['formatMessage'],
  caseType: CaseType,
  decision?: CaseDecision,
) => {
  if (decision === CaseDecision.ACCEPTING_ALTERNATIVE_TRAVEL_BAN) {
    return capitalize(caseTypes[CaseType.TravelBan])
  }

  const type = isIndictmentCase(caseType)
    ? formatMessage(core.indictment)
    : caseTypes[caseType]

  return capitalize(type)
}

export const mapCaseStateToTagVariant = (
  formatMessage: IntlShape['formatMessage'],
  state: CaseState,
  isCourtRole: boolean,
  caseType: CaseType,
  isValidToDateInThePast?: boolean,
  courtDate?: string,
): { color: TagVariant; text: string } => {
  switch (state) {
    case CaseState.NEW:
    case CaseState.DRAFT:
      return { color: 'red', text: formatMessage(m.tags.draft) }
    case CaseState.SUBMITTED:
      return {
        color: 'purple',
        text: formatMessage(isCourtRole ? m.tags.new : m.tags.sent),
      }
    case CaseState.RECEIVED:
      return courtDate
        ? { color: 'mint', text: formatMessage(m.tags.scheduled) }
        : { color: 'blueberry', text: formatMessage(m.tags.received) }
    case CaseState.ACCEPTED:
      return isIndictmentCase(caseType) || isValidToDateInThePast
        ? { color: 'darkerBlue', text: formatMessage(m.tags.inactive) }
        : {
            color: 'blue',
            text: formatMessage(
              isInvestigationCase(caseType) ? m.tags.accepted : m.tags.active,
            ),
          }

    case CaseState.REJECTED:
      return { color: 'rose', text: formatMessage(m.tags.rejected) }
    case CaseState.DISMISSED:
      return { color: 'dark', text: formatMessage(m.tags.dismissed) }
    default:
      return { color: 'white', text: formatMessage(m.tags.unknown) }
  }
}

export const getAppealDate = (
  prosecutorAppealDecision: CaseAppealDecision,
  accusedAppealDecision: CaseAppealDecision,
  prosecutorPostponedAppealDate: string,
  accusedPostponedAppealDate: string,
  rulingDate: string,
) => {
  if (
    prosecutorAppealDecision === CaseAppealDecision.APPEAL ||
    accusedAppealDecision === CaseAppealDecision.APPEAL
  ) {
    return rulingDate
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
