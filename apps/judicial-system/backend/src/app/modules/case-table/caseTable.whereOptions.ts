import { fn, Op, Sequelize, WhereOptions } from 'sequelize'

import {
  CaseAppealState,
  CaseIndictmentRulingDecision,
  CaseState,
  CaseTableType,
  CaseType,
  completedRequestCaseStates,
  EventType,
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
  is_registered_in_prison_system: { [Op.not]: true },
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
  is_registered_in_prison_system: true,
  id: {
    [Op.in]: Sequelize.literal(`
      (SELECT case_id
        FROM defendant
        WHERE is_sent_to_prison_admin = true)
    `),
  },
}

const prosecutorsOfficeIndictmentNewWhereOptions = {
  is_archived: false,
  type: indictmentCases,
  state: CaseState.COMPLETED,
  indictment_ruling_decision: {
    [Op.or]: [
      CaseIndictmentRulingDecision.RULING,
      CaseIndictmentRulingDecision.FINE,
    ],
  },
  id: {
    [Op.in]: Sequelize.literal(`
      (SELECT case_id
        FROM event_log
        WHERE event_type = '${EventType.INDICTMENT_SENT_TO_PUBLIC_PROSECUTOR}')
    `),
  },
  indictment_reviewer_id: null,
}

const prosecutorsOfficeIndictmentInReviewWhereOptions = {
  is_archived: false,
  type: indictmentCases,
  state: CaseState.COMPLETED,
  indictment_ruling_decision: {
    [Op.or]: [
      CaseIndictmentRulingDecision.RULING,
      CaseIndictmentRulingDecision.FINE,
    ],
  },
  id: {
    [Op.in]: Sequelize.literal(`
      (SELECT case_id
        FROM event_log
        WHERE event_type = '${EventType.INDICTMENT_SENT_TO_PUBLIC_PROSECUTOR}')
    `),
  },
  indictment_reviewer_id: { [Op.not]: null },
  indictment_review_decision: null,
}

const prosecutorsOfficeIndictmentReviewedWhereOptions = {
  is_archived: false,
  type: indictmentCases,
  state: CaseState.COMPLETED,
  indictment_ruling_decision: {
    [Op.or]: [
      CaseIndictmentRulingDecision.RULING,
      CaseIndictmentRulingDecision.FINE,
    ],
  },
  indictment_reviewer_id: { [Op.not]: null },
  indictment_review_decision: { [Op.not]: null },
}

const prosecutorsOfficeIndictmentAppealPeriodExpiredWhereOptions = {}

const prosecutorsOfficeIndictmentSentToPrisonAdminWhereOptions = {}

const prosecutorsOfficeIndictmentAppealedWhereOptions = {}

export const caseTableWhereOptions: Record<CaseTableType, WhereOptions> = {
  [CaseTableType.COURT_OF_APPEALS_IN_PROGRESS]:
    courtOfAppealsInProgressWhereOptions,
  [CaseTableType.COURT_OF_APPEALS_COMPLETED]:
    courtOfAppealsCompletedWhereOptions,
  [CaseTableType.PRISON_ACTIVE]: prisonAdminActiveWhereOptions,
  [CaseTableType.PRISON_DONE]: prisonAdminDoneWhereOptions,
  [CaseTableType.PRISON_ADMIN_INDICTMENT_SENT_TO_PRISON_ADMIN]:
    prisonAdminIndictmentSentToPrisonAdminWhereOptions,
  [CaseTableType.PRISON_ADMIN_INDICTMENT_REGISTERED_RULING]:
    prisonAdminIndictmentRegisteredRulingWhereOptions,
  [CaseTableType.PROSECUTORS_OFFICE_INDICTMENT_NEW]:
    prosecutorsOfficeIndictmentNewWhereOptions,
  [CaseTableType.PROSECUTORS_OFFICE_INDICTMENT_IN_REVIEW]:
    prosecutorsOfficeIndictmentInReviewWhereOptions,
  [CaseTableType.PROSECUTORS_OFFICE_INDICTMENT_REVIEWED]:
    prosecutorsOfficeIndictmentReviewedWhereOptions,
  [CaseTableType.PROSECUTORS_OFFICE_INDICTMENT_APPEAL_PERIOD_EXPIRED]:
    prosecutorsOfficeIndictmentAppealPeriodExpiredWhereOptions,
  [CaseTableType.PROSECUTORS_OFFICE_INDICTMENT_SENT_TO_PRISON_ADMIN]:
    prosecutorsOfficeIndictmentSentToPrisonAdminWhereOptions,
  [CaseTableType.PROSECUTORS_OFFICE_INDICTMENT_APPEALED]:
    prosecutorsOfficeIndictmentAppealedWhereOptions,
}
