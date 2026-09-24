import { fn, Op } from 'sequelize'

import {
  AppealCaseState,
  CaseState,
  completedIndictmentCaseStates,
  completedRequestCaseStates,
  restrictionCases,
  type User,
} from '@island.is/judicial-system/types'

import { CaseWhereOptions } from '../caseTable.types'
import {
  prosecutionIndictmentsAccessWhereOptions,
  prosecutionRequestCasesAccessWhereOptions,
} from './access'

// Prosecution request cases

export const prosecutionRequestCasesInProgressWhereOptions = (
  user: User,
): CaseWhereOptions => ({
  where: {
    ...prosecutionRequestCasesAccessWhereOptions(user).where,
    state: [
      CaseState.NEW,
      CaseState.DRAFT,
      CaseState.SUBMITTED,
      CaseState.RECEIVED,
    ],
  },
})

export const prosecutionRequestCasesActiveWhereOptions = (
  user: User,
): CaseWhereOptions => ({
  where: {
    ...prosecutionRequestCasesAccessWhereOptions(user).where,
    type: restrictionCases,
    state: CaseState.ACCEPTED,
    valid_to_date: { [Op.or]: [null, { [Op.gte]: fn('NOW') }] },
  },
})

export const prosecutionRequestCasesAppealedWhereOptions = (
  user: User,
): CaseWhereOptions => ({
  includes: {
    appealCase: {
      attributes: [],
      required: true,
      where: {
        appeal_state: [AppealCaseState.APPEALED, AppealCaseState.RECEIVED],
      },
    },
  },
  where: prosecutionRequestCasesAccessWhereOptions(user).where,
})

export const prosecutionRequestCasesCompletedWhereOptions = (
  user: User,
): CaseWhereOptions => ({
  includes: {
    appealCase: {
      attributes: [],
      required: false,
    },
  },
  where: {
    ...prosecutionRequestCasesAccessWhereOptions(user).where,
    state: completedRequestCaseStates,
    '$appealCase.appeal_state$': {
      [Op.or]: [
        null,
        AppealCaseState.RECEIVED,
        AppealCaseState.WITHDRAWN,
        AppealCaseState.COMPLETED,
      ],
    },
  },
})

// Prosecution indictments
export const prosecutionIndictmentsInDraftWhereOptions = (
  user: User,
): CaseWhereOptions => ({
  where: {
    ...prosecutionIndictmentsAccessWhereOptions(user).where,
    state: [CaseState.DRAFT, CaseState.WAITING_FOR_REVIEW],
  },
})

export const prosecutionIndictmentsWaitingForConfirmationWhereOptions = (
  user: User,
): CaseWhereOptions => ({
  where: {
    ...prosecutionIndictmentsAccessWhereOptions(user).where,
    state: CaseState.WAITING_FOR_CONFIRMATION,
  },
})

export const prosecutionIndictmentsInProgressWhereOptions = (
  user: User,
): CaseWhereOptions => ({
  where: {
    ...prosecutionIndictmentsAccessWhereOptions(user).where,
    state: [CaseState.SUBMITTED, CaseState.RECEIVED],
  },
})

export const prosecutionIndictmentsAppealedWhereOptions = (
  user: User,
): CaseWhereOptions => ({
  includes: {
    appealCase: {
      attributes: [],
      required: false,
      where: {
        appeal_state: [AppealCaseState.APPEALED, AppealCaseState.RECEIVED],
      },
    },
    rulingOrderAppealCases: {
      attributes: [],
      required: false,
      where: {
        appeal_state: [AppealCaseState.APPEALED, AppealCaseState.RECEIVED],
      },
    },
  },
  where: {
    ...prosecutionIndictmentsAccessWhereOptions(user).where,
    [Op.or]: [
      {
        '$appealCase.appeal_state$': [
          AppealCaseState.APPEALED,
          AppealCaseState.RECEIVED,
        ],
      },
      {
        '$rulingOrderAppealCases.appeal_state$': [
          AppealCaseState.APPEALED,
          AppealCaseState.RECEIVED,
        ],
      },
    ],
  },
})

export const prosecutionIndictmentsCompletedWhereOptions = (
  user: User,
): CaseWhereOptions => ({
  where: {
    ...prosecutionIndictmentsAccessWhereOptions(user).where,
    state: [
      CaseState.WAITING_FOR_CANCELLATION,
      ...completedIndictmentCaseStates,
    ],
  },
})
