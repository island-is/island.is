import { Op } from 'sequelize'

import {
  CaseAppealState,
  completedRequestCaseStates,
  investigationCases,
  restrictionCases,
} from '@island.is/judicial-system/types'

// Court of appeals request cases

const courtOfAppealsRequestCasesAccessWhereOptions = {
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

export const courtOfAppealsRequestCasesInProgressWhereOptions = () => ({
  [Op.and]: [
    courtOfAppealsRequestCasesAccessWhereOptions,
    { appeal_state: [CaseAppealState.RECEIVED, CaseAppealState.WITHDRAWN] },
  ],
})

export const courtOfAppealsRequestCasesCompletedWhereOptions = () => ({
  [Op.and]: [
    courtOfAppealsRequestCasesAccessWhereOptions,
    { appeal_state: CaseAppealState.COMPLETED },
  ],
})

// Court of appeals request cases access

export const courtOfAppealsCasesAccessWhereOptions = () =>
  courtOfAppealsRequestCasesAccessWhereOptions
