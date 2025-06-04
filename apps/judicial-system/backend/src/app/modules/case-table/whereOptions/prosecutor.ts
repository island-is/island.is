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

const prosecutorSharedWhereOptions = (user: TUser) => ({
  [Op.or]: [
    { creating_prosecutor_id: user.id },
    { prosecutor_id: user.id },
    { prosecutors_office_id: user.institution?.id },
    { shared_with_prosecutors_office_id: user.institution?.id },
  ],
})

// Prosecutor Request Cases

const prosecutorRequestCasesSharedWhereOptions = (user: TUser) => ({
  is_archived: false,
  type: [...restrictionCases, ...investigationCases],
  is_heightened_security_level: { [Op.or]: [null, false] },
  ...prosecutorSharedWhereOptions(user),
})

export const prosecutorRequestCasesInProgressWhereOptions = (user: TUser) => ({
  ...prosecutorRequestCasesSharedWhereOptions(user),
  state: [CaseState.DRAFT, CaseState.SUBMITTED, CaseState.RECEIVED],
})

export const prosecutorRequestCasesActiveWhereOptions = (user: TUser) => ({
  [Op.and]: [
    prosecutorRequestCasesSharedWhereOptions(user),
    {
      [Op.or]: [
        {
          initial_ruling_date: {
            [Op.or]: [null, { [Op.lte]: fn('NOW') }],
          },
        },
        {
          ruling_date: {
            [Op.or]: [null, { [Op.lte]: fn('NOW') }],
          },
        },
      ],
    },
  ],
  state: [CaseState.ACCEPTED],
  valid_to_date: { [Op.or]: [null, { [Op.gte]: fn('NOW') }] },
})

export const prosecutorRequestCasesAppealedWhereOptions = (user: TUser) => ({
  ...prosecutorRequestCasesSharedWhereOptions(user),
  state: completedRequestCaseStates,
  appeal_state: [CaseAppealState.APPEALED],
})

export const prosecutorRequestCasesCompletedWhereOptions = (user: TUser) => ({
  ...prosecutorRequestCasesSharedWhereOptions(user),
  state: completedRequestCaseStates,
  appeal_state: { [Op.not]: CaseAppealState.APPEALED },
})

// prosecutor indictments

const prosecutorIndictmentSharedWhereOptions = (user: TUser) => ({
  is_archived: false,
  type: indictmentCases,
  ...prosecutorSharedWhereOptions(user),
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
      CaseState.DELETED,
      CaseState.WAITING_FOR_CANCELLATION,
      CaseState.WAITING_FOR_CONFIRMATION,
    ],
  },
})

export const prosecutorIndictmentCompletedWhereOptions = (user: TUser) => ({
  ...prosecutorIndictmentSharedWhereOptions(user),
  state: [CaseState.COMPLETED],
})
