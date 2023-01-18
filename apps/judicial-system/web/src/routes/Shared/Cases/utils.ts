import compareAsc from 'date-fns/compareAsc'
import { IntlShape } from 'react-intl'

import { TagVariant } from '@island.is/island-ui/core'
import {
  CaseAppealDecision,
  CaseDecision,
  CaseState,
  CaseType,
  isIndictmentCase,
  isInvestigationCase,
} from '@island.is/judicial-system/types'
import { core } from '@island.is/judicial-system-web/messages'
import { capitalize, caseTypes } from '@island.is/judicial-system/formatters'

import { cases as m } from './Cases.strings'

export const displayCaseType = (
  formatMessage: IntlShape['formatMessage'],
  caseType: CaseType,
  decision?: CaseDecision | null,
) => {
  if (decision === CaseDecision.AcceptingAlternativeTravelBan) {
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
  isValidToDateInThePast?: boolean | null,
  courtDate?: string | null,
): { color: TagVariant; text: string } => {
  switch (state) {
    case CaseState.New:
    case CaseState.Draft:
      return { color: 'red', text: formatMessage(m.tags.draft) }
    case CaseState.Submitted:
      return {
        color: 'purple',
        text: formatMessage(isCourtRole ? m.tags.new : m.tags.sent),
      }
    case CaseState.Received:
      return courtDate
        ? { color: 'mint', text: formatMessage(m.tags.scheduled) }
        : { color: 'blueberry', text: formatMessage(m.tags.received) }
    case CaseState.Accepted:
      return isIndictmentCase(caseType) || isValidToDateInThePast
        ? { color: 'darkerBlue', text: formatMessage(m.tags.inactive) }
        : {
            color: 'blue',
            text: formatMessage(
              isInvestigationCase(caseType) ? m.tags.accepted : m.tags.active,
            ),
          }

    case CaseState.Rejected:
      return { color: 'rose', text: formatMessage(m.tags.rejected) }
    case CaseState.Dismissed:
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
    prosecutorAppealDecision === CaseAppealDecision.Appeal ||
    accusedAppealDecision === CaseAppealDecision.Appeal
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
