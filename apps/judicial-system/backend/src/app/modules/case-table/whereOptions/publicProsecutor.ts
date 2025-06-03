import { fn, Op } from 'sequelize'

import {
  CaseAppealState,
  CaseIndictmentRulingDecision,
  CaseState,
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

const indictmentSharedWhereOptions = {
  is_archived: false,
  type: indictmentCases,
}

// public prosecutor indictments
// specific for prosecutors at the public prosecutor office

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

const publicProsecutorIndictmentReviewedWhereOptions = {
  indictment_review_decision: { [Op.not]: null },
}

export const getPublicProsecutorIndictmentInReviewWhereOptions = (
  user: TUser,
) => ({
  ...publicProsecutorIndictmentSharedWhereOptions(user),
  ...publicProsecutorIndictmentInReviewWhereOptions,
})

export const getPublicProsecutorIndictmentReviewedWhereOptions = (
  user: TUser,
) => ({
  ...publicProsecutorIndictmentSharedWhereOptions(user),
  ...publicProsecutorIndictmentReviewedWhereOptions,
})
