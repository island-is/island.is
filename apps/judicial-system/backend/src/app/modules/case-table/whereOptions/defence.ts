import { Op } from 'sequelize'

import {
  AppealCaseState,
  CaseState,
  completedIndictmentCaseStates,
  completedRequestCaseStates,
  type User,
} from '@island.is/judicial-system/types'

import { CaseWhereOptions } from '../caseTable.types'
import {
  defenceIndictmentsAccessWhereOptions,
  defenceRequestCasesAccessWhereOptions,
} from './access'

// Defence request cases

export const defenceRequestCasesInProgressWhereOptions = (
  user: User,
): CaseWhereOptions => ({
  where: {
    ...defenceRequestCasesAccessWhereOptions(user),
    state: [CaseState.SUBMITTED, CaseState.RECEIVED],
  },
})

export const defenceRequestCasesAppealedWhereOptions = (
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
  where: defenceRequestCasesAccessWhereOptions(user),
})

export const defenceRequestCasesCompletedWhereOptions = (
  user: User,
): CaseWhereOptions => ({
  includes: {
    appealCase: {
      attributes: [],
      required: false,
    },
  },
  where: {
    ...defenceRequestCasesAccessWhereOptions(user),
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

// Defence indictments

export const defenceIndictmentsInProgressWhereOptions = (
  user: User,
): CaseWhereOptions => ({
  where: {
    ...defenceIndictmentsAccessWhereOptions(user),
    state: CaseState.RECEIVED,
  },
})

export const defenceIndictmentsAppealedWhereOptions = (
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
    [Op.and]: [
      defenceIndictmentsAccessWhereOptions(user),
      {
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
    ],
  },
})

export const defenceIndictmentsCompletedWhereOptions = (
  user: User,
): CaseWhereOptions => ({
  where: {
    ...defenceIndictmentsAccessWhereOptions(user),
    state: [
      CaseState.WAITING_FOR_CANCELLATION,
      ...completedIndictmentCaseStates,
    ],
  },
})
