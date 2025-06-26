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

// Prosecution request cases

const prosecutionRequestCasesSharedWhereOptions = (user: TUser) => ({
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

export const prosecutionRequestCasesInProgressWhereOptions = (user: TUser) => ({
  ...prosecutionRequestCasesSharedWhereOptions(user),
  state: [
    CaseState.NEW,
    CaseState.DRAFT,
    CaseState.SUBMITTED,
    CaseState.RECEIVED,
  ],
})

export const prosecutionRequestCasesActiveWhereOptions = (user: TUser) => ({
  ...prosecutionRequestCasesSharedWhereOptions(user),
  type: restrictionCases,
  state: [CaseState.ACCEPTED],
  valid_to_date: { [Op.or]: [null, { [Op.gte]: fn('NOW') }] },
})

export const prosecutionRequestCasesAppealedWhereOptions = (user: TUser) => ({
  ...prosecutionRequestCasesSharedWhereOptions(user),
  state: completedRequestCaseStates,
  appeal_state: [CaseAppealState.RECEIVED, CaseAppealState.APPEALED],
})

export const prosecutionRequestCasesCompletedWhereOptions = (user: TUser) => ({
  ...prosecutionRequestCasesSharedWhereOptions(user),
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

// Prosecution indictments

const prosecutionIndictmentsSharedWhereOptions = (user: TUser) => ({
  is_archived: false,
  type: indictmentCases,
  prosecutors_office_id: user.institution?.id,
})

export const prosecutionIndictmentsInDraftWhereOptions = (user: TUser) => ({
  ...prosecutionIndictmentsSharedWhereOptions(user),
  state: [CaseState.DRAFT],
})

export const prosecutionIndictmentsWaitingForConfirmationWhereOptions = (
  user: TUser,
) => ({
  ...prosecutionIndictmentsSharedWhereOptions(user),
  state: [CaseState.WAITING_FOR_CONFIRMATION],
})

export const prosecutionIndictmentsInProgressWhereOptions = (user: TUser) => ({
  ...prosecutionIndictmentsSharedWhereOptions(user),
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

export const prosecutionIndictmentsCompletedWhereOptions = (user: TUser) => ({
  ...prosecutionIndictmentsSharedWhereOptions(user),
  state: [CaseState.COMPLETED, CaseState.WAITING_FOR_CANCELLATION],
})
