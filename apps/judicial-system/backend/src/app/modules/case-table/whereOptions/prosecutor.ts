import { fn, Op } from 'sequelize'

import {
  CaseAppealState,
  CaseState,
  completedIndictmentCaseStates,
  completedRequestCaseStates,
  indictmentCases,
  investigationCases,
  restrictionCases,
} from '@island.is/judicial-system/types'
import { type User as TUser } from '@island.is/judicial-system/types'

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

const prosecutorIndictmentSharedWhereOptions = {
  is_archived: false,
  type: indictmentCases,
}

// Prosecutor Indictment Cases

// TODO: This is only for public prosecutor
export const prosecutorIndictmentInReviewWhereOptions = (user: TUser) => ({
  ...prosecutorIndictmentSharedWhereOptions,
  indictment_reviewer_id: user.id,
  indictment_review_decision: null,
})

export const prosecutorIndictmentWaitingForConfirmationWhereOptions = {
  ...prosecutorIndictmentSharedWhereOptions,
  state: [CaseState.WAITING_FOR_CONFIRMATION],
}

export const prosecutorIndictmentInProgressWhereOptions = {
  ...prosecutorIndictmentSharedWhereOptions,
  state: {
    [Op.notIn]: [
      ...completedIndictmentCaseStates,
      CaseState.WAITING_FOR_CONFIRMATION,
    ],
  },
}
export const prosecutorIndictmentCompletedWhereOptions = {
  ...prosecutorIndictmentSharedWhereOptions,
  state: completedIndictmentCaseStates,
}
