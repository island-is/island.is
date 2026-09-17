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

// Appealed verdicts

// In progress from the court's point of view means the appeal has not been
// disposed of: filed and waiting to be received, or received and being worked
// on. A withdrawn appeal is finished, not in progress - which is where this
// parts company with the ruling-appeal list above, on the design's word
// (the withdrawn tag appears under Niðurstaða in "Afgreidd mál").
export const courtOfAppealsVerdictAppealsInProgressWhereOptions =
  (): CaseWhereOptions => ({
    includes: {
      // The access options reference the ruling appeal by alias, so it has to
      // be joined even though these lists say nothing about it.
      appealCase: { attributes: [], required: false },
      verdictAppealCase: {
        attributes: [],
        required: true,
        where: {
          appeal_state: [AppealCaseState.APPEALED, AppealCaseState.RECEIVED],
        },
      },
    },
    where: {
      [Op.and]: [
        courtOfAppealsCasesAccessWhereOptions(),
        {
          '$verdictAppealCase.appeal_state$': [
            AppealCaseState.APPEALED,
            AppealCaseState.RECEIVED,
          ],
        },
      ],
    },
  })

export const courtOfAppealsVerdictAppealsCompletedWhereOptions =
  (): CaseWhereOptions => ({
    includes: {
      appealCase: { attributes: [], required: false },
      verdictAppealCase: {
        attributes: [],
        required: true,
        where: {
          appeal_state: [AppealCaseState.COMPLETED, AppealCaseState.WITHDRAWN],
        },
      },
    },
    where: {
      [Op.and]: [
        courtOfAppealsCasesAccessWhereOptions(),
        {
          '$verdictAppealCase.appeal_state$': [
            AppealCaseState.COMPLETED,
            AppealCaseState.WITHDRAWN,
          ],
        },
      ],
    },
  })
