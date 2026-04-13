import { CaseAppealState } from '@island.is/judicial-system/types'

import { CaseWhereOptions } from '../caseTable.types'
import { courtOfAppealsRequestCasesAccessWhereOptions } from './access'

// Court of appeals request cases

export const courtOfAppealsRequestCasesInProgressWhereOptions =
  (): CaseWhereOptions => ({
    includes: {
      appealCase: {
        attributes: [],
        required: true,
        where: {
          appeal_state: [CaseAppealState.RECEIVED, CaseAppealState.WITHDRAWN],
        },
      },
    },
    where: courtOfAppealsRequestCasesAccessWhereOptions,
  })

export const courtOfAppealsRequestCasesCompletedWhereOptions =
  (): CaseWhereOptions => ({
    includes: {
      appealCase: {
        attributes: [],
        required: true,
        where: {
          appeal_state: CaseAppealState.COMPLETED,
        },
      },
    },
    where: courtOfAppealsRequestCasesAccessWhereOptions,
  })
