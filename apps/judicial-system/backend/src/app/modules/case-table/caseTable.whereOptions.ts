import { fn, literal, Op, Sequelize, where, WhereOptions } from 'sequelize'

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
  ServiceRequirement,
} from '@island.is/judicial-system/types'

const courtOfAppealsSharedWhereOptions = {
  is_archived: false,
  type: [...restrictionCases, ...investigationCases],
  state: completedRequestCaseStates,
  appeal_state: { [Op.not]: null },
}

const courtOfAppealsInProgressWhereOptions = {
  ...courtOfAppealsSharedWhereOptions,
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
  ...courtOfAppealsSharedWhereOptions,
  appeal_state: CaseAppealState.COMPLETED,
}

const prisonAdminSharedWhereOptions = {
  is_archived: false,
  type: [...restrictionCases, CaseType.PAROLE_REVOCATION],
  state: CaseState.ACCEPTED,
}

const prisonAdminActiveWhereOptions = {
  ...prisonAdminSharedWhereOptions,
  valid_to_date: { [Op.or]: [null, { [Op.gte]: fn('NOW') }] },
}

const prisonAdminDoneWhereOptions = {
  ...prisonAdminSharedWhereOptions,
  valid_to_date: { [Op.lt]: fn('NOW') },
}

const prisonAdminIndictmentSharedWhereOptions = {
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

const prisonAdminIndictmentSentToPrisonAdminWhereOptions = {
  ...prisonAdminIndictmentSharedWhereOptions,
  is_registered_in_prison_system: { [Op.not]: true },
}

const prisonAdminIndictmentRegisteredRulingWhereOptions = {
  ...prisonAdminIndictmentSharedWhereOptions,
  is_registered_in_prison_system: true,
}

const prosecutorsOfficeIndictmentSharedWhereOptions = {
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
}

const prosecutorsOfficeIndictmentNewWhereOptions = {
  ...prosecutorsOfficeIndictmentSharedWhereOptions,
  indictment_reviewer_id: null,
}

const prosecutorsOfficeIndictmentInReviewWhereOptions = {
  ...prosecutorsOfficeIndictmentSharedWhereOptions,
  indictment_reviewer_id: { [Op.not]: null },
  indictment_review_decision: null,
}

const prosecutorsOfficeIndictmentReviewedWhereOptions = {
  ...prosecutorsOfficeIndictmentSharedWhereOptions,
  indictment_reviewer_id: { [Op.not]: null },
  indictment_review_decision: IndictmentCaseReviewDecision.ACCEPT,
  [Op.or]: [
    {
      indictment_ruling_decision: CaseIndictmentRulingDecision.FINE,
      [Op.and]: [
        literal(`EXISTS (
          SELECT 1 FROM defendant
          WHERE defendant.case_id = "Case".id
            AND (defendant.is_sent_to_prison_admin IS NULL or defendant.is_sent_to_prison_admin = false)
        )`),
      ],
    },
    {
      indictment_ruling_decision: CaseIndictmentRulingDecision.RULING,
      [Op.and]: [
        literal(`EXISTS (
          SELECT 1 FROM defendant
          WHERE defendant.case_id = "Case".id
            AND defendant.verdict_appeal_date IS NULL
            AND (defendant.is_sent_to_prison_admin IS NULL or defendant.is_sent_to_prison_admin = false)
            AND defendant.service_requirement = '${ServiceRequirement.NOT_REQUIRED}'
        )`),
        where(
          literal(`"ruling_date"::date + INTERVAL '29 days'`),
          Op.gt,
          fn('NOW'),
        ),
      ],
    },
    {
      indictment_ruling_decision: CaseIndictmentRulingDecision.RULING,
      [Op.and]: [
        literal(`EXISTS (
          SELECT 1 FROM defendant
          WHERE defendant.case_id = "Case".id
            AND defendant.verdict_appeal_date IS NULL
            AND (defendant.is_sent_to_prison_admin IS NULL or defendant.is_sent_to_prison_admin = false)
            AND defendant.service_requirement in ('${ServiceRequirement.REQUIRED}', '${ServiceRequirement.NOT_APPLICABLE}')
            AND (
              defendant.verdict_view_date IS NULL
              OR defendant.verdict_view_date + INTERVAL '29 days' > NOW()
            )
        )`),
      ],
    },
  ],
}

const prosecutorsOfficeIndictmentAppealPeriodExpiredWhereOptions = {
  ...prosecutorsOfficeIndictmentSharedWhereOptions,
  indictment_reviewer_id: { [Op.not]: null },
  indictment_review_decision: IndictmentCaseReviewDecision.ACCEPT,
  [Op.and]: [
    { indictment_ruling_decision: CaseIndictmentRulingDecision.RULING },
    {
      [Op.not]: {
        [Op.and]: [
          literal(`EXISTS (
            SELECT 1 FROM defendant
            WHERE defendant.case_id = "Case".id
              AND defendant.verdict_appeal_date IS NULL
              AND (defendant.is_sent_to_prison_admin IS NULL or defendant.is_sent_to_prison_admin = false)
              AND defendant.service_requirement = '${ServiceRequirement.NOT_REQUIRED}'
          )`),
          where(
            literal(`"ruling_date"::date + INTERVAL '29 days'`),
            Op.gt,
            fn('NOW'),
          ),
        ],
      },
    },
    {
      [Op.not]: {
        [Op.and]: [
          literal(`EXISTS (
            SELECT 1 FROM defendant
            WHERE defendant.case_id = "Case".id
              AND defendant.verdict_appeal_date IS NULL
              AND (defendant.is_sent_to_prison_admin IS NULL or defendant.is_sent_to_prison_admin = false)
              AND defendant.service_requirement in ('${ServiceRequirement.REQUIRED}', '${ServiceRequirement.NOT_APPLICABLE}')
              AND (
                defendant.verdict_view_date IS NULL
                OR defendant.verdict_view_date + INTERVAL '29 days' > NOW()
              )
          )`),
        ],
      },
    },
    {
      [Op.and]: [
        literal(`EXISTS (
          SELECT 1 FROM defendant
          WHERE defendant.case_id = "Case".id
            AND defendant.verdict_appeal_date IS NULL
            AND (defendant.is_sent_to_prison_admin IS NULL or defendant.is_sent_to_prison_admin = false)
        )`),
      ],
    },
  ],
}

const prosecutorsOfficeIndictmentSentToPrisonAdminWhereOptions = {
  ...prosecutorsOfficeIndictmentSharedWhereOptions,
  indictment_reviewer_id: { [Op.not]: null },
  indictment_review_decision: IndictmentCaseReviewDecision.ACCEPT,
  [Op.and]: [
    literal(`EXISTS (
      SELECT 1 FROM defendant
      WHERE defendant.case_id = "Case".id
        AND defendant.is_sent_to_prison_admin = true
    )`),
  ],
}

const prosecutorsOfficeIndictmentAppealedWhereOptions = {
  ...prosecutorsOfficeIndictmentSharedWhereOptions,
  indictment_reviewer_id: { [Op.not]: null },
  [Op.or]: [
    { indictment_review_decision: IndictmentCaseReviewDecision.APPEAL },
    {
      [Op.and]: [
        literal(`EXISTS (
          SELECT 1 FROM defendant
          WHERE defendant.case_id = "Case".id
            AND defendant.verdict_appeal_date IS NOT NULL
        )`),
      ],
    },
  ],
}

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
