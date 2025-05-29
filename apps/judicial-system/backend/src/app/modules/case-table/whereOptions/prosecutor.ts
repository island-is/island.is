import { fn, Op } from 'sequelize'

import {
  CaseAppealState,
  CaseState,
  completedRequestCaseStates,
  investigationCases,
  restrictionCases,
} from '@island.is/judicial-system/types'

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

// Prosecutor Indictment Cases
// note this has to be per user, disable "checkbox" in frontend
export const prosecutorIndictmentInReviewWhereOptions = {}
export const prosecutorIndictmentWaitingForConfirmationWhereOptions = {}
export const prosecutorIndictmentWaitingInProgressWhereOptions = {}
export const prosecutorIndictmentCompletedWhereOptions = {}