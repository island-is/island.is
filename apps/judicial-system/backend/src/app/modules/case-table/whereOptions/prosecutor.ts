import { fn, Op } from 'sequelize'

import {
  CaseAppealState,
  CaseState,
  completedIndictmentCaseStates,
  completedRequestCaseStates,
  indictmentCases,
  investigationCases,
  restrictionCases,
  type User as TUser,
} from '@island.is/judicial-system/types'

// Prosecutor Request Cases

const prosecutorRequestCasesSharedWhereOptions = (user: TUser) => ({
  is_archived: false,
  type: [...restrictionCases, ...investigationCases],
  [Op.and]: [
    {
      [Op.or]: [
        { prosecutors_office_id: user.institution?.id },
        { shared_with_prosecutors_office_id: user.institution?.id },
      ],
    },
    {
      [Op.or]: [
        { is_heightened_security_level: { [Op.or]: [null, false] } },
        { creating_prosecutor_id: user.id },
        { prosecutor_id: user.id },
      ],
    },
  ],
})

export const prosecutorRequestCasesInProgressWhereOptions = (user: TUser) => ({
  ...prosecutorRequestCasesSharedWhereOptions(user),
  state: [
    CaseState.NEW,
    CaseState.DRAFT,
    CaseState.SUBMITTED,
    CaseState.RECEIVED,
  ],
})

export const prosecutorRequestCasesActiveWhereOptions = (user: TUser) => ({
  ...prosecutorRequestCasesSharedWhereOptions(user),
  type: restrictionCases,
  state: [CaseState.ACCEPTED],
  valid_to_date: { [Op.or]: [null, { [Op.gte]: fn('NOW') }] },
})

export const prosecutorRequestCasesAppealedWhereOptions = (user: TUser) => ({
  ...prosecutorRequestCasesSharedWhereOptions(user),
  state: completedRequestCaseStates,
  appeal_state: [CaseAppealState.RECEIVED, CaseAppealState.APPEALED],
})

export const prosecutorRequestCasesCompletedWhereOptions = (user: TUser) => ({
  ...prosecutorRequestCasesSharedWhereOptions(user),
  state: completedRequestCaseStates,
  appeal_state: {
    [Op.or]: [
      null,
      CaseAppealState.RECEIVED,
      CaseAppealState.WITHDRAWN,
      CaseAppealState.COMPLETED,
    ],
  },
})

// prosecutor indictments

const prosecutorIndictmentSharedWhereOptions = (user: TUser) => ({
  is_archived: false,
  type: indictmentCases,
  prosecutors_office_id: user.institution?.id,
})

export const prosecutorIndictmentInDraftWhereOptions = (user: TUser) => ({
  ...prosecutorIndictmentSharedWhereOptions(user),
  state: [CaseState.DRAFT],
})

export const prosecutorIndictmentWaitingForConfirmationWhereOptions = (
  user: TUser,
) => ({
  ...prosecutorIndictmentSharedWhereOptions(user),
  state: [CaseState.WAITING_FOR_CONFIRMATION],
})

export const prosecutorIndictmentInProgressWhereOptions = (user: TUser) => ({
  ...prosecutorIndictmentSharedWhereOptions(user),
  state: {
    [Op.notIn]: [
      ...completedIndictmentCaseStates,
      CaseState.DRAFT,
      CaseState.DELETED,
      CaseState.WAITING_FOR_CANCELLATION,
      CaseState.WAITING_FOR_CONFIRMATION,
    ],
  },
})

export const prosecutorIndictmentCompletedWhereOptions = (user: TUser) => ({
  ...prosecutorIndictmentSharedWhereOptions(user),
  state: [CaseState.COMPLETED, CaseState.WAITING_FOR_CANCELLATION],
})
