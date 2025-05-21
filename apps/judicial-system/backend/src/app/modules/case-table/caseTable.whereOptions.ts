import { Op, WhereOptions } from 'sequelize'

import {
  CaseAppealState,
  CaseTableType,
  completedRequestCaseStates,
  investigationCases,
  restrictionCases,
} from '@island.is/judicial-system/types'

export const caseTableWhereOptions: Record<CaseTableType, WhereOptions> = {
  [CaseTableType.COURT_OF_APPEALS_IN_PROGRESS]: {
    is_archived: false,
    type: [...restrictionCases, ...investigationCases],
    state: completedRequestCaseStates,
    [Op.or]: [
      { appeal_state: CaseAppealState.RECEIVED },
      {
        [Op.and]: [
          { appeal_state: [CaseAppealState.WITHDRAWN] },
          { appeal_received_by_court_date: { [Op.not]: null } },
        ],
      },
    ],
  },
  [CaseTableType.COURT_OF_APPEALS_COMPLETED]: {
    is_archived: false,
    type: [...restrictionCases, ...investigationCases],
    state: completedRequestCaseStates,
    appeal_state: CaseAppealState.COMPLETED,
  },
}
