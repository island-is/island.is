import { fn, Op, Sequelize, WhereOptions } from 'sequelize'

import {
  CaseAppealState,
  CaseIndictmentRulingDecision,
  CaseState,
  CaseTableType,
  CaseType,
  completedRequestCaseStates,
  IndictmentCaseReviewDecision,
  indictmentCases,
  investigationCases,
  restrictionCases,
} from '@island.is/judicial-system/types'

const courtOfAppealsInProgressWhereOptions = {
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
}

const courtOfAppealsCompletedWhereOptions = {
  is_archived: false,
  type: [...restrictionCases, ...investigationCases],
  state: completedRequestCaseStates,
  appeal_state: CaseAppealState.COMPLETED,
}

const prisonAdminActiveWhereOptions = {
  is_archived: false,
  type: [...restrictionCases, CaseType.PAROLE_REVOCATION],
  state: CaseState.ACCEPTED,
  valid_to_date: { [Op.or]: [null, { [Op.gte]: fn('NOW') }] },
}

const prisonAdminDoneWhereOptions = {
  is_archived: false,
  type: [...restrictionCases, CaseType.PAROLE_REVOCATION],
  state: CaseState.ACCEPTED,
  valid_to_date: { [Op.lt]: fn('NOW') },
}

const prisonAdminIndictmentSentToPrisonAdminWhereOptions = {
  is_archived: false,
  type: indictmentCases,
  state: CaseState.COMPLETED,
  indictment_ruling_decision: {
    [Op.or]: [
      CaseIndictmentRulingDecision.RULING,
      CaseIndictmentRulingDecision.FINE,
    ],
  },
  indictment_review_decision: IndictmentCaseReviewDecision.ACCEPT,
  id: {
    [Op.in]: Sequelize.literal(`
      (SELECT case_id
        FROM defendant
        WHERE is_sent_to_prison_admin = true)
    `),
  },
}

const prisonAdminIndictmentRegisteredRulingWhereOptions = {
  is_archived: false,
  type: indictmentCases,
  state: CaseState.COMPLETED,
  indictment_ruling_decision: {
    [Op.or]: [
      CaseIndictmentRulingDecision.RULING,
      CaseIndictmentRulingDecision.FINE,
    ],
  },
  indictment_review_decision: IndictmentCaseReviewDecision.ACCEPT,
  id: {
    [Op.in]: Sequelize.literal(`
      (SELECT case_id
        FROM defendant
        WHERE is_sent_to_prison_admin = true)
    `),
  },
}

export const caseTableWhereOptions: Record<CaseTableType, WhereOptions> = {
  [CaseTableType.COURT_OF_APPEALS_IN_PROGRESS]:
    courtOfAppealsInProgressWhereOptions,
  [CaseTableType.COURT_OF_APPEALS_COMPLETED]:
    courtOfAppealsCompletedWhereOptions,
  [CaseTableType.PRISON_ADMIN_ACTIVE]: prisonAdminActiveWhereOptions,
  [CaseTableType.PRISON_ADMIN_DONE]: prisonAdminDoneWhereOptions,
  [CaseTableType.PRISON_ADMIN_INDICTMENT_SENT_TO_PRISON_ADMIN]:
    prisonAdminIndictmentSentToPrisonAdminWhereOptions,
  [CaseTableType.PRISON_ADMIN_INDICTMENT_REGISTERED_RULING]:
    prisonAdminIndictmentRegisteredRulingWhereOptions,
}
