export { Feature } from './lib/feature'

export {
  Gender,
  DefenderChoice,
  SubpoenaType,
  DefendantPlea,
  ServiceRequirement,
  ServiceStatus,
  PunishmentType,
  VerdictAppealDecision,
  isSuccessfulServiceStatus,
  isFailedServiceStatus,
} from './lib/defendant'
export { InstitutionType } from './lib/institution'
export {
  CaseNotificationType,
  SubpoenaNotificationType,
  NotificationType,
  InstitutionNotificationType,
  NotificationDispatchType,
  DefendantNotificationType,
  CivilClaimantNotificationType,
  IndictmentCaseNotificationType,
  EventNotificationType,
  notificationTypes,
} from './lib/notification'
export type { Institution } from './lib/institution'
export {
  EventType,
  eventTypes,
  DefendantEventType,
  defendantEventTypes,
} from './lib/eventLog'
export { DateType, dateTypes } from './lib/dateLog'
export { StringType, stringTypes } from './lib/caseString'

export { CaseFileState, CaseFileCategory, HashAlgorithm } from './lib/file'

export {
  UserRole,
  prosecutionRoles,
  isProsecutionUser,
  publicProsecutorRoles,
  isPublicProsecutorUser,
  districtCourtRoles,
  isDistrictCourtUser,
  courtOfAppealsRoles,
  isCourtOfAppealsUser,
  prisonSystemRoles,
  isPrisonSystemUser,
  isPrisonStaffUser,
  defenceRoles,
  isDefenceUser,
  isAdminUser,
  isCoreUser,
  isPrisonAdminUser,
  isPublicProsecutor,
} from './lib/user'
export type { User } from './lib/user'

export {
  CaseOrigin,
  CaseType,
  IndictmentSubtype,
  CaseState,
  IndictmentCaseState,
  CaseAppealState,
  RequestCaseState,
  CaseTransition,
  IndictmentCaseTransition,
  RequestCaseTransition,
  CaseLegalProvisions,
  CaseCustodyRestrictions,
  CaseAppealDecision,
  CaseDecision,
  CaseAppealRulingDecision,
  CaseIndictmentRulingDecision,
  RequestSharedWithDefender,
  SessionArrangements,
  indictmentCases,
  restrictionCases,
  investigationCases,
  IndictmentCaseReviewDecision,
  IndictmentDecision,
  isIndictmentCase,
  isRestrictionCase,
  isInvestigationCase,
  isRequestCase,
  isAcceptingCaseDecision,
  isTrafficViolationCase,
  hasTrafficViolationSubtype,
  completedRequestCaseStates,
  completedIndictmentCaseStates,
  completedCaseStates,
  isCompletedCase,
  hasIndictmentCaseBeenSubmittedToCourt,
  getStatementDeadline,
  isIndictmentCaseState,
  isRequestCaseState,
  isIndictmentCaseTransition,
  isRequestCaseTransition,
  CourtSessionType,
  courtSessionTypeNames,
} from './lib/case'

export { getIndictmentVerdictAppealDeadlineStatus } from './lib/indictmentCase'

export {
  getIndictmentAppealDeadlineDate,
  getAppealDeadlineDate,
  hasDatePassed,
} from './lib/dates'

export type {
  CrimeScene,
  CrimeSceneMap,
  IndictmentSubtypeMap,
} from './lib/case'

export {
  IndictmentCountOffense,
  offenseSubstances,
} from './lib/indictmentCount'

export { Substance } from './lib/substances'

export { type Lawyer, mapToLawyer } from './lib/lawyer'

export type { SubstanceMap } from './lib/indictmentCount'

export type { CourtDocument } from './lib/courtDocument'
