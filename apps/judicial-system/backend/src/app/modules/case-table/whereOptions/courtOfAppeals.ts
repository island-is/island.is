import { Op } from 'sequelize'

import {
  CaseAppealState,
  completedRequestCaseStates,
  investigationCases,
  restrictionCases,
} from '@island.is/judicial-system/types'

// Court of appeals request cases

const courtOfAppealsSharedWhereOptions = {
  is_archived: false,
  type: [...restrictionCases, ...investigationCases],
  state: completedRequestCaseStates,
  appeal_state: { [Op.not]: null },
}

export const courtOfAppealsRequestCasesInProgressWhereOptions = {
  ...courtOfAppealsSharedWhereOptions,
  [Op.or]: [
    { appeal_state: CaseAppealState.RECEIVED },
    {
      appeal_state: [CaseAppealState.WITHDRAWN],
      appeal_received_by_court_date: { [Op.not]: null },
    },
  ],
}

export const courtOfAppealsRequestCasesCompletedWhereOptions = {
  ...courtOfAppealsSharedWhereOptions,
  appeal_state: CaseAppealState.COMPLETED,
}
