import { Op } from 'sequelize'

import {
  AppealCaseState,
  CaseState,
  completedIndictmentCaseStates,
  completedRequestCaseStates,
  type User,
} from '@island.is/judicial-system/types'

import {
  CaseWhereOptions,
  presentLatestCaseAppealAsRowAppeal,
  presentVerdictAppealAsRowAppeal,
} from '../caseTable.types'
import {
  defenceIndictmentsAccessWhereOptions,
  defenceRequestCasesAccessWhereOptions,
} from './access'
import { buildIsConfirmedVerdictAppealAdvocateCondition } from './conditions'

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

// The appealed verdicts this user is an advocate on at the court of appeals,
// while the appeal is still being heard there.
//
// The access options admit a case for the district court advocate as well, so
// the list asks again who holds the appeal: an advocate who only had the case
// in the district court keeps it among their completed cases and does not
// follow it to the court of appeals.
//
// One row per case, about the verdict appeal, which is what the columns read.
// An appeal the court of appeals has confirmed but not completed stays on the
// list, where it reads as under advisement: leaving it would tell the advocate
// that the court has concluded. A completed appeal, or one that was withdrawn,
// drops off; the case stays among the completed ones throughout.
export const defenceIndictmentsVerdictAppealedWhereOptions = (
  user: User,
): CaseWhereOptions => ({
  includes: {
    verdictAppealCase: {
      attributes: [],
      required: true,
      where: {
        appeal_state: [
          AppealCaseState.APPEALED,
          AppealCaseState.RECEIVED,
          AppealCaseState.READY_TO_COMPLETE,
        ],
      },
    },
  },
  where: {
    [Op.and]: [
      defenceIndictmentsAccessWhereOptions(user),
      buildIsConfirmedVerdictAppealAdvocateCondition(user.nationalId),
      {
        '$verdictAppealCase.appeal_state$': [
          AppealCaseState.APPEALED,
          AppealCaseState.RECEIVED,
          AppealCaseState.READY_TO_COMPLETE,
        ],
      },
    ],
  },
  displayCases: presentVerdictAppealAsRowAppeal,
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
  // An appealed verdict stays on this list while the court of appeals hears
  // it, so its row is about that appeal and carries its case number.
  displayCases: presentLatestCaseAppealAsRowAppeal,
})
