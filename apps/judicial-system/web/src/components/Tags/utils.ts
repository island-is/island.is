import { TagVariant } from '@island.is/island-ui/core'
import {
  isDistrictCourtUser,
  isPublicProsecutorUser,
} from '@island.is/judicial-system/types'

import {
  Case,
  CaseIndictmentRulingDecision,
  CaseListEntry,
  CaseState,
  IndictmentDecision,
  User,
} from '../../graphql/schema'
import { strings } from './CaseTag.strings'

export const getIndictmentCaseStateTag = (
  caseListEntry: CaseListEntry,
  user?: User,
): {
  color: TagVariant
  text: { id: string; defaultMessage: string; description: string }
} => {
  const {
    state,
    indictmentReviewer,
    indictmentRulingDecision,
    indictmentDecision,
    courtDate,
  } = caseListEntry

  switch (state) {
    case CaseState.NEW:
    case CaseState.DRAFT:
    case CaseState.WAITING_FOR_CONFIRMATION:
      return { color: 'red', text: strings.draft }
    case CaseState.SUBMITTED:
      return {
        color: 'purple',
        text: isDistrictCourtUser(user) ? strings.new : strings.sent,
      }
    case CaseState.RECEIVED:
      return getReceivedIndictmentStateTag(indictmentDecision, courtDate)
    case CaseState.COMPLETED:
      return getCompletedIndictmentStateTag(
        indictmentReviewer,
        user,
        indictmentRulingDecision,
      )
    case CaseState.WAITING_FOR_CANCELLATION:
      return {
        color: 'rose',
        text: strings.recalled,
      }
    default:
      return { color: 'white', text: strings.unknown }
  }
}

const getReceivedIndictmentStateTag = (
  indictmentDecision?: IndictmentDecision | null,
  courtDate?: string | null,
): {
  color: TagVariant
  text: { id: string; defaultMessage: string; description: string }
} => {
  switch (indictmentDecision) {
    case IndictmentDecision.POSTPONING:
    case IndictmentDecision.SCHEDULING:
    case IndictmentDecision.COMPLETING:
      return { color: 'mint', text: strings.scheduled }
    case IndictmentDecision.POSTPONING_UNTIL_VERDICT:
      return { color: 'mint', text: strings.postponedUntilVerdict }
    case IndictmentDecision.REDISTRIBUTING:
      return { color: 'blue', text: strings.reassignment }
    default:
      return courtDate
        ? { color: 'mint', text: strings.scheduled }
        : { color: 'blueberry', text: strings.received }
  }
}

const getCompletedIndictmentStateTag = (
  indictmentReviewer?: User | null,
  user?: User,
  indictmentRulingDecision?: CaseIndictmentRulingDecision | null,
): {
  color: TagVariant
  text: { id: string; defaultMessage: string; description: string }
} => {
  if (isPublicProsecutorUser(user)) {
    return {
      color: indictmentReviewer ? 'mint' : 'purple',
      text: indictmentReviewer ? strings.beingReviewed : strings.new,
    }
  }
  return getIndictmentRulingDecisionTag(indictmentRulingDecision)
}

export const getIndictmentRulingDecisionTag = (
  indictmentRulingDecision?: CaseIndictmentRulingDecision | null,
): {
  color: TagVariant
  text: { id: string; defaultMessage: string; description: string }
} => {
  switch (indictmentRulingDecision) {
    case CaseIndictmentRulingDecision.FINE:
      return { color: 'mint', text: strings.indictmentFine }
    case CaseIndictmentRulingDecision.CANCELLATION:
      return { color: 'rose', text: strings.indictmentCancellation }
    case CaseIndictmentRulingDecision.MERGE:
      return { color: 'rose', text: strings.merged }
    case CaseIndictmentRulingDecision.DISMISSAL:
      return { color: 'blue', text: strings.indictmentDismissal }
    case CaseIndictmentRulingDecision.RULING:
      return { color: 'darkerBlue', text: strings.indictmentRuling }
    case CaseIndictmentRulingDecision.WITHDRAWAL:
      return { color: 'rose', text: strings.indictmentWithdrawal }
    default:
      return { color: 'darkerBlue', text: strings.complete }
  }
}
