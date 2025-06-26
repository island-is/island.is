import { fn, Op } from 'sequelize'

import {
  CaseDecision,
  CaseState,
  CaseType,
} from '@island.is/judicial-system/types'

// Prison staff request cases

const prisonRequestCasesSharedWhereOptions = {
  is_archived: false,
  type: [
    CaseType.CUSTODY,
    CaseType.ADMISSION_TO_FACILITY,
    CaseType.PAROLE_REVOCATION,
  ],
  state: CaseState.ACCEPTED,
  decision: [CaseDecision.ACCEPTING, CaseDecision.ACCEPTING_PARTIALLY],
}

export const prisonRequestCasesActiveWhereOptions = {
  ...prisonRequestCasesSharedWhereOptions,
  valid_to_date: { [Op.or]: [null, { [Op.gte]: fn('NOW') }] },
}

export const prisonRequestCasesDoneWhereOptions = {
  ...prisonRequestCasesSharedWhereOptions,
  valid_to_date: { [Op.lt]: fn('NOW') },
}
