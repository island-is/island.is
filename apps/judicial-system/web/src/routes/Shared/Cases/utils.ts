import compareAsc from 'date-fns/compareAsc'
import { IntlShape } from 'react-intl'

import { TagVariant } from '@island.is/island-ui/core'
import { CaseAppealDecision, CaseState } from '@island.is/judicial-system/types'
import { requests } from '@island.is/judicial-system-web/messages'

export const mapCaseStateToTagVariant = (
  formatMessage: IntlShape['formatMessage'],
  state: CaseState,
  isCourtRole: boolean,
  isInvestigationCase?: boolean,
  isValidToDateInThePast?: boolean,
  courtDate?: string,
): { color: TagVariant; text: string } => {
  switch (state) {
    case CaseState.NEW:
    case CaseState.DRAFT:
      return { color: 'red', text: formatMessage(requests.tags.draft) }
    case CaseState.SUBMITTED:
      return {
        color: 'purple',
        text: formatMessage(
          isCourtRole ? requests.tags.new : requests.tags.sent,
        ),
      }
    case CaseState.RECEIVED:
      return courtDate
        ? { color: 'mint', text: formatMessage(requests.tags.scheduled) }
        : { color: 'blueberry', text: formatMessage(requests.tags.received) }
    case CaseState.ACCEPTED:
      return isValidToDateInThePast
        ? { color: 'darkerBlue', text: formatMessage(requests.tags.inactive) }
        : {
            color: 'blue',
            text: formatMessage(
              isInvestigationCase
                ? requests.tags.accepted
                : requests.tags.active,
            ),
          }

    case CaseState.REJECTED:
      return { color: 'rose', text: formatMessage(requests.tags.rejected) }
    case CaseState.DISMISSED:
      return { color: 'dark', text: formatMessage(requests.tags.dismissed) }
    default:
      return { color: 'white', text: formatMessage(requests.tags.unknown) }
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
