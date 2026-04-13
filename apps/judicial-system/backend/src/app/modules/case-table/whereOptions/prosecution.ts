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
    ...prosecutionRequestCasesAccessWhereOptions(user),
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
    ...prosecutionRequestCasesAccessWhereOptions(user),
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
  where: {
    ...prosecutionRequestCasesAccessWhereOptions(user),
    state: completedRequestCaseStates,
  },
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
    ...prosecutionRequestCasesAccessWhereOptions(user),
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
    ...prosecutionIndictmentsAccessWhereOptions(user),
    state: CaseState.DRAFT,
  },
})

export const prosecutionIndictmentsWaitingForConfirmationWhereOptions = (
  user: User,
): CaseWhereOptions => ({
  where: {
    ...prosecutionIndictmentsAccessWhereOptions(user),
    state: CaseState.WAITING_FOR_CONFIRMATION,
  },
})

export const prosecutionIndictmentsInProgressWhereOptions = (
  user: User,
): CaseWhereOptions => ({
  where: {
    ...prosecutionIndictmentsAccessWhereOptions(user),
    state: [CaseState.SUBMITTED, CaseState.RECEIVED],
  },
})

export const prosecutionIndictmentsAppealedWhereOptions = (
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
  where: {
    ...prosecutionIndictmentsAccessWhereOptions(user),
    state: completedIndictmentCaseStates,
  },
})

export const prosecutionIndictmentsCompletedWhereOptions = (
  user: User,
): CaseWhereOptions => ({
  where: {
    ...prosecutionIndictmentsAccessWhereOptions(user),
    state: [
      CaseState.WAITING_FOR_CANCELLATION,
      ...completedIndictmentCaseStates,
    ],
  },
})
