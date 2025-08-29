export { Feature } from './lib/feature'

export {
  Gender,
  DefenderChoice,
  SubpoenaType,
  DefendantPlea,
  ServiceStatus,
  PunishmentType,
  isSuccessfulServiceStatus,
  isFailedServiceStatus,
} from './lib/defendant'

export {
  ServiceRequirement,
  VerdictAppealDecision,
  InformationForDefendant,
  informationForDefendantMap,
} from './lib/verdict'

export {
  InstitutionType,
  prosecutorsOfficeTypes,
  isProsecutorsOffice,
} from './lib/institution'
export type { Institution } from './lib/institution'

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
  DefenderSubRole,
  prosecutionRoles,
  isProsecutionUser,
  isProsecutorUser,
  isProsecutorRepresentativeUser,
  getContactInformation,
  publicProsecutionOfficeRoles,
  isPublicProsecutionOfficeUser,
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
  isPublicProsecutionUser,
  getAdminUserInstitutionScope,
  getAdminUserInstitutionUserRoles,
} from './lib/user'
export type { User, UserDescriptor, InstitutionUser } from './lib/user'

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
  RequestSharedWhen,
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
  isTrafficViolationIndictmentCount,
  getIndictmentCountCompare,
} from './lib/indictmentCount'
export type { SubstanceMap } from './lib/indictmentCount'

export { Substance } from './lib/substances'

export {
  type Lawyer,
  mapToLawyer,
  type LawyerFull,
  type LawyerRegistry,
  LawyerType,
} from './lib/lawyer'

export { type CourtDocument } from './lib/courtDocument'

export { type CaseTableColumnKey } from './lib/tables/caseTableColumnTypes'
export { getCaseTableType, caseTables } from './lib/tables/caseTable'
export {
  CaseActionType,
  ContextMenuCaseActionType,
  CaseTableType,
} from './lib/tables/caseTableTypes'
export { getCaseTableGroups } from './lib/tables/caseTableGroup'
