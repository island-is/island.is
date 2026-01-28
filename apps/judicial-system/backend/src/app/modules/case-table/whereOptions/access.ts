import { Op } from 'sequelize'

import {
  CaseAppealState,
  CaseDecision,
  CaseIndictmentRulingDecision,
  CaseState,
  CaseType,
  completedIndictmentCaseStates,
  completedRequestCaseStates,
  EventType,
  IndictmentCaseReviewDecision,
  indictmentCases,
  investigationCases,
  restrictionCases,
  User,
} from '@island.is/judicial-system/types'

import {
  buildEventLogExistsCondition,
  buildIsSentToPrisonExistsCondition,
} from './conditions'

// Court of appeals access

export const courtOfAppealsRequestCasesAccessWhereOptions = {
  is_archived: false,
  type: [...restrictionCases, ...investigationCases],
  state: completedRequestCaseStates,
  [Op.or]: [
    {
      appeal_state: [CaseAppealState.RECEIVED, CaseAppealState.COMPLETED],
    },
    {
      [Op.and]: [
        { appeal_state: CaseAppealState.WITHDRAWN },
        { appeal_received_by_court_date: { [Op.not]: null } },
      ],
    },
  ],
}

export const courtOfAppealsCasesAccessWhereOptions = () =>
  courtOfAppealsRequestCasesAccessWhereOptions

// District court access

export const districtCourtRequestCasesAccessWhereOptions = (user: User) => ({
  is_archived: false,
  type: [...restrictionCases, ...investigationCases],
  state: [
    CaseState.DRAFT,
    CaseState.SUBMITTED,
    CaseState.RECEIVED,
    ...completedRequestCaseStates,
  ],
  court_id: user.institution?.id,
})

export const districtCourtIndictmentsAccessWhereOptions = (user: User) => ({
  is_archived: false,
  type: indictmentCases,
  state: [
    CaseState.SUBMITTED,
    CaseState.WAITING_FOR_CANCELLATION,
    CaseState.RECEIVED,
    ...completedIndictmentCaseStates,
  ],
  court_id: user.institution?.id,
})

export const districtCourtCasesAccessWhereOptions = (user: User) => ({
  [Op.or]: [
    districtCourtRequestCasesAccessWhereOptions(user),
    districtCourtIndictmentsAccessWhereOptions(user),
  ],
})

// Prison staff access

export const prisonStaffRequestCasesAccessWhereOptions = {
  is_archived: false,
  type: [
    CaseType.CUSTODY,
    CaseType.ADMISSION_TO_FACILITY,
    CaseType.PAROLE_REVOCATION,
  ],
  state: CaseState.ACCEPTED,
  decision: [CaseDecision.ACCEPTING, CaseDecision.ACCEPTING_PARTIALLY],
}

export const prisonStaffCasesAccessWhereOptions = () =>
  prisonStaffRequestCasesAccessWhereOptions

// Prision admin access

export const prisonAdminRequestCasesAccessWhereOptions = {
  is_archived: false,
  type: [...restrictionCases, CaseType.PAROLE_REVOCATION],
  state: CaseState.ACCEPTED,
}

export const prisonAdminIndictmentsAccessWhereOptions = {
  is_archived: false,
  type: indictmentCases,
  state: completedIndictmentCaseStates,
  indictment_ruling_decision: [
    CaseIndictmentRulingDecision.RULING,
    CaseIndictmentRulingDecision.FINE,
  ],
  // indictment_review_decision: IndictmentCaseReviewDecision.ACCEPT,
  [Op.and]: [buildIsSentToPrisonExistsCondition(true)],
}

export const prisonAdminCasesAccessWhereOptions = () => ({
  [Op.or]: [
    prisonAdminRequestCasesAccessWhereOptions,
    prisonAdminIndictmentsAccessWhereOptions,
  ],
})

// Public prosecution office access

export const publicProsecutionOfficeIndictmentsAccessWhereOptions = {
  is_archived: false,
  type: indictmentCases,
  state: completedIndictmentCaseStates,
  indictment_ruling_decision: [
    CaseIndictmentRulingDecision.RULING,
    CaseIndictmentRulingDecision.FINE,
  ],
  [Op.and]: [
    buildEventLogExistsCondition(
      EventType.INDICTMENT_SENT_TO_PUBLIC_PROSECUTOR,
      true,
    ),
  ],
}

export const publicProsecutionOfficeCasesAccessWhereOptions = () =>
  publicProsecutionOfficeIndictmentsAccessWhereOptions

// Prosecution access

export const prosecutionRequestCasesAccessWhereOptions = (user: User) => ({
  is_archived: false,
  type: [...restrictionCases, ...investigationCases],
  state: [
    CaseState.NEW,
    CaseState.DRAFT,
    CaseState.SUBMITTED,
    CaseState.RECEIVED,
    ...completedRequestCaseStates,
  ],
  [Op.and]: [
    {
      [Op.or]: [
        { prosecutors_office_id: user.institution?.id },
        { shared_with_prosecutors_office_id: user.institution?.id },
      ],
    },
    {
      [Op.or]: [
        { is_heightened_security_level: { [Op.not]: true } },
        { creating_prosecutor_id: user.id },
        { prosecutor_id: user.id },
      ],
    },
  ],
})

export const prosecutionIndictmentsAccessWhereOptions = (user: User) => ({
  is_archived: false,
  type: indictmentCases,
  state: [
    CaseState.DRAFT,
    CaseState.WAITING_FOR_CONFIRMATION,
    CaseState.SUBMITTED,
    CaseState.RECEIVED,
    CaseState.WAITING_FOR_CANCELLATION,
    ...completedIndictmentCaseStates,
  ],
  prosecutors_office_id: user.institution?.id,
})

export const prosecutorCasesAccessWhereOptions = (user: User) => ({
  [Op.or]: [
    prosecutionRequestCasesAccessWhereOptions(user),
    prosecutionIndictmentsAccessWhereOptions(user),
  ],
})

export const prosecutorRepresentativeCasesAccessWhereOptions = (user: User) =>
  prosecutionIndictmentsAccessWhereOptions(user)

// Public prosecution access

export const publicProsecutionIndictmentsAccessWhereOptions = (user: User) => ({
  is_archived: false,
  type: indictmentCases,
  state: completedIndictmentCaseStates,
  indictment_ruling_decision: [
    CaseIndictmentRulingDecision.FINE,
    CaseIndictmentRulingDecision.RULING,
  ],
  [Op.and]: [
    buildEventLogExistsCondition(
      EventType.INDICTMENT_SENT_TO_PUBLIC_PROSECUTOR,
      true,
    ),
  ],
  indictment_reviewer_id: user.id,
})

export const publicProsecutionCasesAccessWhereOptions = (user: User) => ({
  [Op.or]: [
    prosecutorCasesAccessWhereOptions(user),
    publicProsecutionIndictmentsAccessWhereOptions(user),
  ],
})
