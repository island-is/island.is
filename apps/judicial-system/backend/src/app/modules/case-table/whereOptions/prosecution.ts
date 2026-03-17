import { fn, Op, where } from 'sequelize'

import {
  CaseAppealState,
  CaseState,
  completedIndictmentCaseStates,
  completedRequestCaseStates,
  restrictionCases,
  type User,
} from '@island.is/judicial-system/types'

import {
  prosecutionIndictmentsAccessWhereOptions,
  prosecutionRequestCasesAccessWhereOptions,
} from './access'

// Prosecution request cases

export const prosecutionRequestCasesInProgressWhereOptions = (user: User) => ({
  where: {
    ...prosecutionRequestCasesAccessWhereOptions(user),
    state: [
      CaseState.NEW,
      CaseState.DRAFT,
      CaseState.SUBMITTED,
      CaseState.RECEIVED,
    ],
  },
})

export const prosecutionRequestCasesActiveWhereOptions = (user: User) => ({
  where: {
    ...prosecutionRequestCasesAccessWhereOptions(user),
    type: restrictionCases,
    state: CaseState.ACCEPTED,
    valid_to_date: { [Op.or]: [null, { [Op.gte]: fn('NOW') }] },
  },
})

export const prosecutionRequestCasesAppealedWhereOptions = (user: User) => ({
  where: {
    ...prosecutionRequestCasesAccessWhereOptions(user),
    state: completedRequestCaseStates,
    appeal_state: [CaseAppealState.RECEIVED, CaseAppealState.APPEALED],
  },
})

export const prosecutionRequestCasesCompletedWhereOptions = (user: User) => ({
  where: {
    ...prosecutionRequestCasesAccessWhereOptions(user),
    state: completedRequestCaseStates,
    appeal_state: {
      [Op.or]: [
        null,
        CaseAppealState.RECEIVED,
        CaseAppealState.WITHDRAWN,
        CaseAppealState.COMPLETED,
      ],
    },
  },
})

// Prosecution indictments

export const prosecutionIndictmentsInDraftWhereOptions = (user: User) => ({
  where: {
    ...prosecutionIndictmentsAccessWhereOptions(user),
    state: CaseState.DRAFT,
  },
})

export const prosecutionIndictmentsWaitingForConfirmationWhereOptions = (
  user: User,
) => ({
  where: {
    ...prosecutionIndictmentsAccessWhereOptions(user),
    state: CaseState.WAITING_FOR_CONFIRMATION,
  },
})

export const prosecutionIndictmentsInProgressWhereOptions = (user: User) => ({
  where: {
    ...prosecutionIndictmentsAccessWhereOptions(user),
    state: [CaseState.SUBMITTED, CaseState.RECEIVED],
  },
})

export const prosecutionIndictmentsCompletedWhereOptions = (user: User) => ({
  where: {
    ...prosecutionIndictmentsAccessWhereOptions(user),
    state: [
      CaseState.WAITING_FOR_CANCELLATION,
      ...completedIndictmentCaseStates,
    ],
  },
})
