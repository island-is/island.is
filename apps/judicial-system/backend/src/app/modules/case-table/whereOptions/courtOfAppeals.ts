import { Op } from 'sequelize'

import { CaseAppealState } from '@island.is/judicial-system/types'

import { courtOfAppealsRequestCasesAccessWhereOptions } from './access'

// Court of appeals request cases

export const courtOfAppealsRequestCasesInProgressWhereOptions = () => ({
  where: {
    [Op.and]: [
      courtOfAppealsRequestCasesAccessWhereOptions,
      { appeal_state: [CaseAppealState.RECEIVED, CaseAppealState.WITHDRAWN] },
    ],
  },
})

export const courtOfAppealsRequestCasesCompletedWhereOptions = () => ({
  where: {
    [Op.and]: [
      courtOfAppealsRequestCasesAccessWhereOptions,
      { appeal_state: CaseAppealState.COMPLETED },
    ],
  },
})
