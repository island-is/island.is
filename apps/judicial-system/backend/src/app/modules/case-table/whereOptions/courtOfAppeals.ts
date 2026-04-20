import { AppealCaseState } from '@island.is/judicial-system/types'

import { CaseWhereOptions } from '../caseTable.types'
import { courtOfAppealsCasesAccessWhereOptions } from './access'

// Court of appeals cases

export const courtOfAppealsCasesInProgressWhereOptions =
  (): CaseWhereOptions => ({
    includes: {
      appealCase: {
        attributes: [],
        required: true,
        where: {
          appeal_state: [AppealCaseState.RECEIVED, AppealCaseState.WITHDRAWN],
        },
      },
    },
    where: courtOfAppealsCasesAccessWhereOptions(),
  })

export const courtOfAppealsCasesCompletedWhereOptions =
  (): CaseWhereOptions => ({
    includes: {
      appealCase: {
        attributes: [],
        required: true,
        where: {
          appeal_state: AppealCaseState.COMPLETED,
        },
      },
    },
    where: courtOfAppealsCasesAccessWhereOptions(),
  })
