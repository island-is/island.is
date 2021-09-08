import { TagVariant } from '@island.is/island-ui/core'
import { CaseAppealDecision, CaseState } from '@island.is/judicial-system/types'
import compareAsc from 'date-fns/compareAsc'

export const mapCaseStateToTagVariant = (
  state: CaseState,
  isCourtRole: boolean,
  isInvestigationCase?: boolean,
  isValidToDateInThePast?: boolean,
): { color: TagVariant; text: string } => {
  switch (state) {
    case CaseState.NEW:
    case CaseState.DRAFT:
      return { color: 'red', text: 'Drög' }
    case CaseState.SUBMITTED:
      return {
        color: 'purple',
        text: `${isCourtRole ? 'Ný krafa' : 'Krafa send'}`,
      }
    case CaseState.RECEIVED:
      return { color: 'blueberry', text: 'Krafa móttekin' }
    case CaseState.ACCEPTED:
      if (isValidToDateInThePast) {
        return {
          color: 'darkerBlue',
          text: 'Lokið',
        }
      } else {
        return {
          color: 'blue',
          text: isInvestigationCase ? 'Samþykkt' : 'Virkt',
        }
      }
    case CaseState.REJECTED:
      return {
        color: 'rose',
        text: 'Hafnað',
      }
    default:
      return { color: 'white', text: 'Óþekkt' }
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
