import { Op } from 'sequelize'

import { AppealCaseState } from '@island.is/judicial-system/types'

import { CaseWhereOptions, expandCasesWithAppeals } from '../caseTable.types'
import { courtOfAppealsCasesAccessWhereOptions } from './access'

// Court of appeals cases

export const courtOfAppealsCasesInProgressWhereOptions =
  (): CaseWhereOptions => ({
    includes: {
      appealCase: {
        attributes: [],
        required: false,
        where: {
          appeal_state: [AppealCaseState.RECEIVED, AppealCaseState.WITHDRAWN],
        },
      },
      rulingOrderAppealCases: {
        attributes: [],
        required: false,
        where: {
          appeal_state: [AppealCaseState.RECEIVED, AppealCaseState.WITHDRAWN],
        },
      },
    },
    where: {
      [Op.and]: [
        courtOfAppealsCasesAccessWhereOptions(),
        {
          [Op.or]: [
            {
              '$appealCase.appeal_state$': [
                AppealCaseState.RECEIVED,
                AppealCaseState.WITHDRAWN,
              ],
            },
            {
              '$rulingOrderAppealCases.appeal_state$': [
                AppealCaseState.RECEIVED,
                AppealCaseState.WITHDRAWN,
              ],
            },
          ],
        },
      ],
    },
    displayCases: expandCasesWithAppeals,
  })

export const courtOfAppealsCasesCompletedWhereOptions =
  (): CaseWhereOptions => ({
    includes: {
      appealCase: {
        attributes: [],
        required: false,
        where: { appeal_state: AppealCaseState.COMPLETED },
      },
      rulingOrderAppealCases: {
        attributes: [],
        required: false,
        where: { appeal_state: AppealCaseState.COMPLETED },
      },
    },
    where: {
      [Op.and]: [
        courtOfAppealsCasesAccessWhereOptions(),
        {
          [Op.or]: [
            { '$appealCase.appeal_state$': AppealCaseState.COMPLETED },
            {
              '$rulingOrderAppealCases.appeal_state$':
                AppealCaseState.COMPLETED,
            },
          ],
        },
      ],
    },
    displayCases: expandCasesWithAppeals,
  })
