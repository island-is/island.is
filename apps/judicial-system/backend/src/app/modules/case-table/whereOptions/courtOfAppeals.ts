import { Op } from 'sequelize'

import {
  CaseAppealState,
  completedRequestCaseStates,
  investigationCases,
  restrictionCases,
} from '@island.is/judicial-system/types'

// Court of appeals request cases

export const courtOfAppealsRequestCasesAccessWhereOptions = {
  is_archived: false,
  type: [...restrictionCases, ...investigationCases],
  state: completedRequestCaseStates,
  [Op.or]: [
    { appeal_state: [CaseAppealState.RECEIVED, CaseAppealState.COMPLETED] },
    {
      [Op.and]: [
        { appeal_state: [CaseAppealState.WITHDRAWN] },
        { appeal_received_by_court_date: { [Op.not]: null } },
      ],
    },
  ],
}

export const courtOfAppealsRequestCasesInProgressWhereOptions = {
  ...courtOfAppealsRequestCasesAccessWhereOptions,
  [Op.or]: [
    { appeal_state: CaseAppealState.RECEIVED },
    {
      appeal_state: [CaseAppealState.WITHDRAWN],
      appeal_received_by_court_date: { [Op.not]: null },
    },
  ],
}

export const courtOfAppealsRequestCasesCompletedWhereOptions = {
  ...courtOfAppealsRequestCasesAccessWhereOptions,
  appeal_state: CaseAppealState.COMPLETED,
}
