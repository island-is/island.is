import { PoliceCaseStatusValue } from './enums'
import { m } from '../messages'
import { PoliceCaseStatusInfoMap } from './types'

export const NAMESPACE = ['api.law-and-order']

export const POLICE_CASE_STATUS_INFO: PoliceCaseStatusInfoMap = {
  [PoliceCaseStatusValue.RECEIVED]: {
    header: m.policeInvestigation,
    description: m.statusDescriptionReceived,
  },
  [PoliceCaseStatusValue.BACK_TO_INVESTIGATION]: {
    header: m.criminalInvestigation,
    description: m.statusDescriptionBackToInvestigation,
  },
  [PoliceCaseStatusValue.UNDER_INVESTIGATION]: {
    header: m.criminalInvestigation,
    description: m.statusDescriptionUnderInvestigation,
  },
  [PoliceCaseStatusValue.CASE_ON_HOLD]: {
    header: m.criminalInvestigation,
    description: m.statusDescriptionCaseOnHold,
  },
  [PoliceCaseStatusValue.CASE_SENT_TO_OTHER_DEPARTMENT]: {
    header: m.criminalInvestigation,
    description: m.statusDescriptionCaseSentToOtherDepartment,
  },
  [PoliceCaseStatusValue.PROSECUTOR_REVIEW]: {
    header: m.postInvestigation,
    description: m.statusDescriptionProsecutorReview,
  },
  [PoliceCaseStatusValue.INVESTIGATION_STOPPED]: {
    header: m.postInvestigation,
    description: m.statusDescriptionInvestigationStopped,
  },
  [PoliceCaseStatusValue.CASE_DISMISSED]: {
    header: m.postInvestigation,
    description: m.statusDescriptionCaseDismissed,
  },
  [PoliceCaseStatusValue.DECISION_APPEALED]: {
    header: m.postInvestigation,
    description: m.statusDescriptionDecisionAppealed,
  },
  [PoliceCaseStatusValue.DECISION_CONFIRMED]: {
    header: m.postInvestigation,
    description: m.statusDescriptionDecisionConfirmed,
  },
  [PoliceCaseStatusValue.DECISION_OVERTURNED]: {
    header: m.postInvestigation,
    description: m.statusDescriptionDecisionOverturned,
  },
  [PoliceCaseStatusValue.CASE_CLOSED]: {
    header: m.postInvestigation,
    description: m.statusDescriptionCaseClosed,
  },
  [PoliceCaseStatusValue.PROSECUTION_DROPPED]: {
    header: m.postInvestigation,
    description: m.statusDescriptionProsecutionDropped,
  },
  [PoliceCaseStatusValue.DISTRICT_PROSECUTOR_REVIEW]: {
    header: m.postInvestigation,
    description: m.statusDescriptionDistrictProsecutorReview,
  },
  [PoliceCaseStatusValue.INDICTMENT]: {
    header: m.indictment,
    description: m.statusDescriptionIndictment,
  },
  [PoliceCaseStatusValue.COURT_SCHEDULING]: {
    header: m.caseSentToCourt,
    description: m.statusDescriptionCourtScheduling,
  },
  [PoliceCaseStatusValue.RULING_ANNOUNCED]: {
    header: m.caseSentToCourt,
    description: m.statusDescriptionRulingAnnounced,
  },
  [PoliceCaseStatusValue.DISTRICT_COURT_PROCEEDINGS]: {
    header: m.caseSentToCourt,
    description: m.statusDescriptionDistrictCourtProceedings,
  },
  [PoliceCaseStatusValue.CLOSED_BY_DISTRICT_COURT]: {
    header: m.caseSentToCourt,
    description: m.statusDescriptionClosedByDistrictCourt,
  },
  [PoliceCaseStatusValue.APPEAL]: {
    header: m.caseSentToCourt,
    description: m.statusDescriptionAppeal,
  },
  [PoliceCaseStatusValue.MEDIATION]: {
    header: m.caseSentToCourt,
    description: m.statusDescriptionMediation,
  },
  [PoliceCaseStatusValue.SUPREME_COURT_APPEAL_REQUEST]: {
    header: m.caseSentToCourt,
    description: m.statusDescriptionSupremeCourtAppealRequest,
  },
}
