import { fn, literal, Op, Sequelize, where, WhereOptions } from 'sequelize'

import {
  CaseAppealState,
  CaseDecision,
  CaseIndictmentRulingDecision,
  CaseState,
  CaseTableType,
  CaseType,
  completedRequestCaseStates,
  EventType,
  IndictmentCaseReviewDecision,
  indictmentCases,
  investigationCases,
  isDistrictCourtUser,
  restrictionCases,
  ServiceRequirement,
  type User as TUser,
} from '@island.is/judicial-system/types'

import {
  buildAlternativeServiceExistsCondition,
  buildEventLogExistsCondition,
  buildSubpoenaExistsCondition,
} from './whereOptions/conditions'
import {
  prosecutorIndictmentCompletedWhereOptions,
  prosecutorIndictmentInDraftWhereOptions,
  prosecutorIndictmentInProgressWhereOptions,
  prosecutorIndictmentWaitingForConfirmationWhereOptions,
  prosecutorRequestCasesActiveWhereOptions,
  prosecutorRequestCasesAppealedWhereOptions,
  prosecutorRequestCasesCompletedWhereOptions,
  prosecutorRequestCasesInProgressWhereOptions,
} from './whereOptions/prosecutor'
import {
  publicProsecutorIndictmentInReviewWhereOptions,
  publicProsecutorIndictmentReviewedWhereOptions,
} from './whereOptions/publicProsecutor'

// District Court Request Cases

const districtCourtRequestCasesSharedWhereOptions = {
  is_archived: false,
  type: [...restrictionCases, ...investigationCases],
}

const districtCourtRequestCasesInProgressWhereOptions = {
  ...districtCourtRequestCasesSharedWhereOptions,
  [Op.or]: [
    { state: [CaseState.DRAFT, CaseState.SUBMITTED, CaseState.RECEIVED] },
    {
      state: completedRequestCaseStates,
      ruling_signature_date: null,
      is_completed_without_ruling: null,
      appeal_state: {
        [Op.or]: [
          null,
          CaseAppealState.RECEIVED,
          CaseAppealState.WITHDRAWN,
          CaseAppealState.COMPLETED,
        ],
      },
    },
  ],
}

const districtCourtRequestCasesAppealedWhereOptions = {
  ...districtCourtRequestCasesSharedWhereOptions,
  state: completedRequestCaseStates,
  appeal_state: [CaseAppealState.APPEALED],
}

const districtCourtRequestCasesCompletedWhereOptions = {
  ...districtCourtRequestCasesSharedWhereOptions,
  state: completedRequestCaseStates,
  [Op.or]: [
    { ruling_signature_date: { [Op.not]: null } },
    { is_completed_without_ruling: { [Op.not]: null } },
  ],
  appeal_state: {
    [Op.or]: [
      null,
      CaseAppealState.RECEIVED,
      CaseAppealState.WITHDRAWN,
      CaseAppealState.COMPLETED,
    ],
  },
}

// District Court Indictments

const districtCourtIndictmentsSharedWhereOptions = {
  is_archived: false,
  type: indictmentCases,
}

const districtCourtIndictmentsNewWhereOptions = {
  ...districtCourtIndictmentsSharedWhereOptions,
  state: [CaseState.SUBMITTED, CaseState.RECEIVED],
  judge_id: null,
}

const districtCourtIndictmentsReceivedWhereOptions = {
  ...districtCourtIndictmentsSharedWhereOptions,
  state: CaseState.RECEIVED,
  judge_id: { [Op.not]: null },
  [Op.and]: [
    buildSubpoenaExistsCondition(false),
    buildAlternativeServiceExistsCondition(false),
  ],
}

const districtCourtIndictmentsInProgressWhereOptions = {
  ...districtCourtIndictmentsSharedWhereOptions,
  [Op.or]: [
    {
      state: CaseState.RECEIVED,
      [Op.or]: [
        buildSubpoenaExistsCondition(true),
        buildAlternativeServiceExistsCondition(true),
      ],
    },
    { state: CaseState.WAITING_FOR_CANCELLATION },
  ],
}

const districtCourtIndictmentsFinalizingWhereOptions = {
  ...districtCourtIndictmentsSharedWhereOptions,
  state: CaseState.COMPLETED,
  indictment_ruling_decision: [
    CaseIndictmentRulingDecision.RULING,
    CaseIndictmentRulingDecision.FINE,
  ],
  [Op.and]: [
    buildEventLogExistsCondition(
      EventType.INDICTMENT_SENT_TO_PUBLIC_PROSECUTOR,
      false,
    ),
  ],
}

const districtCourtIndictmentsCompletedWhereOptions = {
  ...districtCourtIndictmentsSharedWhereOptions,
  state: CaseState.COMPLETED,
  [Op.not]: {
    indictment_ruling_decision: [
      CaseIndictmentRulingDecision.RULING,
      CaseIndictmentRulingDecision.FINE,
    ],
    [Op.and]: [
      buildEventLogExistsCondition(
        EventType.INDICTMENT_SENT_TO_PUBLIC_PROSECUTOR,
        false,
      ),
    ],
  },
}

// Court of Appeals Cases

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
      appeal_state: [CaseAppealState.WITHDRAWN],
      appeal_received_by_court_date: { [Op.not]: null },
    },
  ],
}

const courtOfAppealsCompletedWhereOptions = {
  ...courtOfAppealsSharedWhereOptions,
  appeal_state: CaseAppealState.COMPLETED,
}

// Prison Staff Request Cases

const prisonSharedWhereOptions = {
  is_archived: false,
  type: [
    CaseType.CUSTODY,
    CaseType.ADMISSION_TO_FACILITY,
    CaseType.PAROLE_REVOCATION,
  ],
  state: CaseState.ACCEPTED,
  decision: [CaseDecision.ACCEPTING, CaseDecision.ACCEPTING_PARTIALLY],
}

const prisonActiveWhereOptions = {
  ...prisonSharedWhereOptions,
  valid_to_date: { [Op.or]: [null, { [Op.gte]: fn('NOW') }] },
}

const prisonDoneWhereOptions = {
  ...prisonSharedWhereOptions,
  valid_to_date: { [Op.lt]: fn('NOW') },
}

// Prison Admin Indictments

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
  indictment_ruling_decision: [
    CaseIndictmentRulingDecision.RULING,
    CaseIndictmentRulingDecision.FINE,
  ],
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

// Prosecutor's Office Indictments

const prosecutorsOfficeIndictmentSharedWhereOptions = {
  is_archived: false,
  type: indictmentCases,
  state: CaseState.COMPLETED,
  indictment_ruling_decision: [
    CaseIndictmentRulingDecision.RULING,
    CaseIndictmentRulingDecision.FINE,
  ],
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

const withUserFilter = (
  whereOptions: WhereOptions,
  user: TUser,
): WhereOptions => {
  return isDistrictCourtUser(user)
    ? { ...whereOptions, court_id: user.institution?.id }
    : whereOptions
}

export const caseTableWhereOptions: Record<
  CaseTableType,
  (user: TUser) => WhereOptions
> = {
  [CaseTableType.DISTRICT_COURT_REQUEST_CASES_IN_PROGRESS]: (user) =>
    withUserFilter(districtCourtRequestCasesInProgressWhereOptions, user),
  [CaseTableType.DISTRICT_COURT_REQUEST_CASES_APPEALED]: (user) =>
    withUserFilter(districtCourtRequestCasesAppealedWhereOptions, user),
  [CaseTableType.DISTRICT_COURT_REQUEST_CASES_COMPLETED]: (user) =>
    withUserFilter(districtCourtRequestCasesCompletedWhereOptions, user),
  [CaseTableType.DISTRICT_COURT_INDICTMENTS_NEW]: (user) =>
    withUserFilter(districtCourtIndictmentsNewWhereOptions, user),
  [CaseTableType.DISTRICT_COURT_INDICTMENTS_RECEIVED]: (user) =>
    withUserFilter(districtCourtIndictmentsReceivedWhereOptions, user),
  [CaseTableType.DISTRICT_COURT_INDICTMENTS_IN_PROGRESS]: (user) =>
    withUserFilter(districtCourtIndictmentsInProgressWhereOptions, user),
  [CaseTableType.DISTRICT_COURT_INDICTMENTS_FINALIZING]: (user) =>
    withUserFilter(districtCourtIndictmentsFinalizingWhereOptions, user),
  [CaseTableType.DISTRICT_COURT_INDICTMENTS_COMPLETED]: (user) =>
    withUserFilter(districtCourtIndictmentsCompletedWhereOptions, user),
  [CaseTableType.COURT_OF_APPEALS_IN_PROGRESS]: () =>
    courtOfAppealsInProgressWhereOptions,
  [CaseTableType.COURT_OF_APPEALS_COMPLETED]: () =>
    courtOfAppealsCompletedWhereOptions,
  [CaseTableType.PRISON_ACTIVE]: () => prisonActiveWhereOptions,
  [CaseTableType.PRISON_DONE]: () => prisonDoneWhereOptions,
  [CaseTableType.PRISON_ADMIN_ACTIVE]: () => prisonAdminActiveWhereOptions,
  [CaseTableType.PRISON_ADMIN_DONE]: () => prisonAdminDoneWhereOptions,
  [CaseTableType.PRISON_ADMIN_INDICTMENT_SENT_TO_PRISON_ADMIN]: () =>
    prisonAdminIndictmentSentToPrisonAdminWhereOptions,
  [CaseTableType.PRISON_ADMIN_INDICTMENT_REGISTERED_RULING]: () =>
    prisonAdminIndictmentRegisteredRulingWhereOptions,
  [CaseTableType.PROSECUTORS_OFFICE_INDICTMENT_NEW]: () =>
    prosecutorsOfficeIndictmentNewWhereOptions,
  [CaseTableType.PROSECUTORS_OFFICE_INDICTMENT_IN_REVIEW]: () =>
    prosecutorsOfficeIndictmentInReviewWhereOptions,
  [CaseTableType.PROSECUTORS_OFFICE_INDICTMENT_REVIEWED]: () =>
    prosecutorsOfficeIndictmentReviewedWhereOptions,
  [CaseTableType.PROSECUTORS_OFFICE_INDICTMENT_APPEAL_PERIOD_EXPIRED]: () =>
    prosecutorsOfficeIndictmentAppealPeriodExpiredWhereOptions,
  [CaseTableType.PROSECUTORS_OFFICE_INDICTMENT_SENT_TO_PRISON_ADMIN]: () =>
    prosecutorsOfficeIndictmentSentToPrisonAdminWhereOptions,
  [CaseTableType.PROSECUTORS_OFFICE_INDICTMENT_APPEALED]: () =>
    prosecutorsOfficeIndictmentAppealedWhereOptions,
  [CaseTableType.PROSECUTOR_REQUEST_CASES_IN_PROGRESS]: (user) =>
    prosecutorRequestCasesInProgressWhereOptions(user),
  [CaseTableType.PROSECUTOR_REQUEST_CASES_ACTIVE]: (user) =>
    prosecutorRequestCasesActiveWhereOptions(user),
  [CaseTableType.PROSECUTOR_REQUEST_CASES_APPEALED]: (user) =>
    prosecutorRequestCasesAppealedWhereOptions(user),
  [CaseTableType.PROSECUTOR_REQUEST_CASES_COMPLETED]: (user) =>
    prosecutorRequestCasesCompletedWhereOptions(user),
  [CaseTableType.PUBLIC_PROSECUTOR_INDICTMENT_IN_REVIEW]: (user) =>
    publicProsecutorIndictmentInReviewWhereOptions(user),
  [CaseTableType.PUBLIC_PROSECUTOR_INDICTMENT_REVIEWED]: (user) =>
    publicProsecutorIndictmentReviewedWhereOptions(user),
  [CaseTableType.PROSECUTOR_INDICTMENT_IN_DRAFT]: (user) =>
    prosecutorIndictmentInDraftWhereOptions(user),
  [CaseTableType.PROSECUTOR_INDICTMENT_WAITING_FOR_CONFIRMATION]: (user) =>
    prosecutorIndictmentWaitingForConfirmationWhereOptions(user),
  [CaseTableType.PROSECUTOR_INDICTMENT_IN_PROGRESS]: (user) =>
    prosecutorIndictmentInProgressWhereOptions(user),
  [CaseTableType.PROSECUTOR_INDICTMENT_COMPLETED]: (user) =>
    prosecutorIndictmentCompletedWhereOptions(user),
}
