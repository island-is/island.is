import { PoliceCaseStatusValue, PoliceCaseStatusValueGroup } from './enums'
import { m } from '../messages'
import { PoliceCaseStatusInfoMap } from './types'

export const NAMESPACE = ['api.law-and-order']

export const POLICE_CASE_STATUS_INFO: PoliceCaseStatusInfoMap = {
  [PoliceCaseStatusValue.RECEIVED]: {
    group: PoliceCaseStatusValueGroup.POLICE_ANALYSIS,
    header: m.policeAnalysis,
    description: m.statusDescriptionReceived,
  },
  [PoliceCaseStatusValue.BACK_TO_INVESTIGATION]: {
    group: PoliceCaseStatusValueGroup.CRIMINAL_INVESTIGATION,
    header: m.criminalInvestigation,
    description: m.statusDescriptionBackToInvestigation,
  },
  [PoliceCaseStatusValue.UNDER_INVESTIGATION]: {
    group: PoliceCaseStatusValueGroup.CRIMINAL_INVESTIGATION,
    header: m.criminalInvestigation,
    description: m.statusDescriptionUnderInvestigation,
  },
  [PoliceCaseStatusValue.CASE_ON_HOLD]: {
    group: PoliceCaseStatusValueGroup.CRIMINAL_INVESTIGATION,
    header: m.criminalInvestigation,
    description: m.statusDescriptionCaseOnHold,
  },
  [PoliceCaseStatusValue.CASE_SENT_TO_OTHER_DEPARTMENT]: {
    group: PoliceCaseStatusValueGroup.CRIMINAL_INVESTIGATION,
    header: m.criminalInvestigation,
    description: m.statusDescriptionCaseSentToOtherDepartment,
  },
  [PoliceCaseStatusValue.PROSECUTOR_REVIEW]: {
    group: PoliceCaseStatusValueGroup.POST_INVESTIGATION,
    header: m.postInvestigation,
    description: m.statusDescriptionProsecutorReview,
  },
  [PoliceCaseStatusValue.INVESTIGATION_STOPPED]: {
    group: PoliceCaseStatusValueGroup.POST_INVESTIGATION,
    header: m.postInvestigation,
    description: m.statusDescriptionInvestigationStopped,
  },
  [PoliceCaseStatusValue.CASE_DISMISSED]: {
    group: PoliceCaseStatusValueGroup.POST_INVESTIGATION,
    header: m.postInvestigation,
    description: m.statusDescriptionCaseDismissed,
  },
  [PoliceCaseStatusValue.DECISION_APPEALED]: {
    group: PoliceCaseStatusValueGroup.POST_INVESTIGATION,
    header: m.postInvestigation,
    description: m.statusDescriptionDecisionAppealed,
  },
  [PoliceCaseStatusValue.DECISION_CONFIRMED]: {
    group: PoliceCaseStatusValueGroup.POST_INVESTIGATION,
    header: m.postInvestigation,
    description: m.statusDescriptionDecisionConfirmed,
  },
  [PoliceCaseStatusValue.DECISION_OVERTURNED]: {
    group: PoliceCaseStatusValueGroup.POST_INVESTIGATION,
    header: m.postInvestigation,
    description: m.statusDescriptionDecisionOverturned,
  },
  [PoliceCaseStatusValue.CASE_CLOSED]: {
    group: PoliceCaseStatusValueGroup.POST_INVESTIGATION,
    header: m.postInvestigation,
    description: m.statusDescriptionCaseClosed,
  },
  [PoliceCaseStatusValue.PROSECUTION_DROPPED]: {
    group: PoliceCaseStatusValueGroup.POST_INVESTIGATION,
    header: m.postInvestigation,
    description: m.statusDescriptionProsecutionDropped,
  },
  [PoliceCaseStatusValue.DISTRICT_PROSECUTOR_REVIEW]: {
    group: PoliceCaseStatusValueGroup.POST_INVESTIGATION,
    header: m.postInvestigation,
    description: m.statusDescriptionDistrictProsecutorReview,
  },
  [PoliceCaseStatusValue.INDICTMENT]: {
    group: PoliceCaseStatusValueGroup.INDICTMENT,
    header: m.indictment,
    description: m.statusDescriptionIndictment,
  },
  [PoliceCaseStatusValue.COURT_SCHEDULING]: {
    group: PoliceCaseStatusValueGroup.SENT_TO_COURT,
    header: m.caseSentToCourt,
    description: m.statusDescriptionCourtScheduling,
  },
  [PoliceCaseStatusValue.RULING_ANNOUNCED]: {
    group: PoliceCaseStatusValueGroup.SENT_TO_COURT,
    header: m.caseSentToCourt,
    description: m.statusDescriptionRulingAnnounced,
  },
  [PoliceCaseStatusValue.DISTRICT_COURT_PROCEEDINGS]: {
    group: PoliceCaseStatusValueGroup.SENT_TO_COURT,
    header: m.caseSentToCourt,
    description: m.statusDescriptionDistrictCourtProceedings,
  },
  [PoliceCaseStatusValue.CLOSED_BY_DISTRICT_COURT]: {
    group: PoliceCaseStatusValueGroup.SENT_TO_COURT,
    header: m.caseSentToCourt,
    description: m.statusDescriptionClosedByDistrictCourt,
  },
  [PoliceCaseStatusValue.APPEAL]: {
    group: PoliceCaseStatusValueGroup.SENT_TO_COURT,
    header: m.caseSentToCourt,
    description: m.statusDescriptionAppeal,
  },
  [PoliceCaseStatusValue.MEDIATION]: {
    group: PoliceCaseStatusValueGroup.SENT_TO_COURT,
    header: m.caseSentToCourt,
    description: m.statusDescriptionMediation,
  },
  [PoliceCaseStatusValue.SUPREME_COURT_APPEAL_REQUEST]: {
    group: PoliceCaseStatusValueGroup.SENT_TO_COURT,
    header: m.caseSentToCourt,
    description: m.statusDescriptionSupremeCourtAppealRequest,
  },
}

export const POLICE_CASE_GROUP_TIMELINE_STEP_LOOKUP = {
  [PoliceCaseStatusValueGroup.POLICE_ANALYSIS]: 1,
  [PoliceCaseStatusValueGroup.CRIMINAL_INVESTIGATION]: 2,
  [PoliceCaseStatusValueGroup.POST_INVESTIGATION]: 3,
  [PoliceCaseStatusValueGroup.INDICTMENT]: 4,
  [PoliceCaseStatusValueGroup.SENT_TO_COURT]: 5,
  [PoliceCaseStatusValueGroup.UNKNOWN]: -1,
}
