import { TagVariant } from '@island.is/island-ui/core'
import {
  isDistrictCourtUser,
  isPublicProsecutionOfficeUser,
} from '@island.is/judicial-system/types'

import {
  CaseIndictmentRulingDecision,
  CaseListEntry,
  CaseState,
  IndictmentDecision,
  PunishmentType,
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
  if (isPublicProsecutionOfficeUser(user)) {
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

export const getPunishmentTypeTag = (
  punishmentType?: PunishmentType | null,
): {
  color: TagVariant
  text: { id: string; defaultMessage: string; description: string }
} | null => {
  if (!punishmentType) return null

  const getPunishmentTypeLabel = (punishmentType?: PunishmentType | null) => {
    switch (punishmentType) {
      case PunishmentType.IMPRISONMENT:
        return strings.punishmentTypeImprisonment
      case PunishmentType.PROBATION:
        return strings.punishmentTypeProbation
      case PunishmentType.FINE:
        return strings.punishmentTypeFine
      case PunishmentType.INDICTMENT_RULING_DECISION_FINE:
        return strings.punishmentTypeIndictmentRulingDecisionFine
      case PunishmentType.SIGNED_FINE_INVITATION:
        return strings.punishmentTypeSignedFineInvitation
      case PunishmentType.OTHER:
        return strings.punishmentTypeOther
      default:
        return strings.unknown
    }
  }

  return {
    color: 'red' as TagVariant,
    text: getPunishmentTypeLabel(punishmentType),
  }
}

export const getPrisonCaseStateTag = (
  prisonCaseState: CaseState,
): {
  color: TagVariant
  text: { id: string; defaultMessage: string; description: string }
} => {
  switch (prisonCaseState) {
    case CaseState.NEW:
      return { color: 'purple', text: strings.new }
    case CaseState.RECEIVED:
      return { color: 'blue', text: strings.received }
    default:
      return { color: 'darkerBlue', text: strings.complete }
  }
}
