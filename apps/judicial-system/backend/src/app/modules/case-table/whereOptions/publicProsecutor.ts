import { fn, Op, WhereOptions } from 'sequelize'

import {
  CaseAppealState,
  CaseIndictmentRulingDecision,
  CaseState,
  completedIndictmentCaseStates,
  completedRequestCaseStates,
  EventType,
  indictmentCases,
  investigationCases,
  restrictionCases,
  type User as TUser,
} from '@island.is/judicial-system/types'

import { buildEventLogExistsCondition } from './conditions'

// Prosecutor Request Cases

const prosecutorRequestCasesSharedWhereOptions = {
  is_archived: false,
  type: [...restrictionCases, ...investigationCases],
}

export const prosecutorRequestCasesInProgressWhereOptions = {
  ...prosecutorRequestCasesSharedWhereOptions,
  state: [CaseState.DRAFT, CaseState.SUBMITTED, CaseState.RECEIVED],
}

export const prosecutorRequestCasesActiveWhereOptions = {
  ...prosecutorRequestCasesSharedWhereOptions,
  state: [CaseState.ACCEPTED],
  [Op.or]: [
    { initial_ruling_date: { [Op.or]: [null, { [Op.lte]: fn('NOW') }] } },
    { ruling_date: { [Op.or]: [null, { [Op.lte]: fn('NOW') }] } },
  ],
  valid_to_date: { [Op.or]: [null, { [Op.gte]: fn('NOW') }] },
}

export const prosecutorRequestCasesAppealedWhereOptions = {
  ...prosecutorRequestCasesSharedWhereOptions,
  state: completedRequestCaseStates,
  appeal_state: [CaseAppealState.APPEALED],
}

export const prosecutorRequestCasesCompletedWhereOptions = {
  ...prosecutorRequestCasesSharedWhereOptions,
  state: completedRequestCaseStates,
  appeal_state: { [Op.not]: CaseAppealState.APPEALED },
}

// Indictments

const indictmentSharedWhereOptions = {
  is_archived: false,
  type: indictmentCases,
}

// public prosecutor

const publicProsecutorIndictmentSharedWhereOptions = (user: TUser) => ({
  ...indictmentSharedWhereOptions,
  indictment_ruling_decision: [
    CaseIndictmentRulingDecision.FINE,
    CaseIndictmentRulingDecision.RULING,
  ],
  [Op.and]: [
    buildEventLogExistsCondition(
      EventType.INDICTMENT_SENT_TO_PUBLIC_PROSECUTOR,
      true,
    ),
  ],
  indictment_reviewer_id: user.id,
})

const publicProsecutorIndictmentInReviewWhereOptions = {
  indictment_review_decision: null,
}

const publicProsecutorIndictmentCompletedWhereOptions = {
  state: CaseState.COMPLETED,
}

// prosecutor

const prosecutorIndictmentSharedWhereOptions = (user: TUser) => ({
  ...indictmentSharedWhereOptions,
  [Op.or]: [{ creating_prosecutor_id: user.id }, { prosecutor_id: user.id }],
})

const prosecutorIndictmentInProgressWhereOptions = {
  state: {
    [Op.notIn]: [
      ...completedIndictmentCaseStates,
      CaseState.DELETED,
      CaseState.WAITING_FOR_CANCELLATION,
      CaseState.WAITING_FOR_CONFIRMATION,
    ],
  },
}

const prosecutorIndictmentWaitingForConfirmationWhereOptions = {
  state: [CaseState.WAITING_FOR_CONFIRMATION],
}

export const getPublicProsecutorIndictmentInReviewWhereOptions = (
  user: TUser,
) => ({
  ...publicProsecutorIndictmentSharedWhereOptions(user),
  ...publicProsecutorIndictmentInReviewWhereOptions,
})

export const getPublicProsecutorIndictmentCompletedWhereOptions = (
  user: TUser,
) => ({
  ...publicProsecutorIndictmentSharedWhereOptions(user),
  ...publicProsecutorIndictmentCompletedWhereOptions,
})

export const getProsecutorIndictmentWaitingForConfirmationWhereOptions = (
  user: TUser,
) => ({
  ...prosecutorIndictmentSharedWhereOptions(user),
  ...prosecutorIndictmentWaitingForConfirmationWhereOptions,
})

export const getProsecutorIndictmentInProgressWhereOptions = (user: TUser) => ({
  ...prosecutorIndictmentSharedWhereOptions(user),
  ...prosecutorIndictmentInProgressWhereOptions,
})

// TODO: add prosecutor completed cases
