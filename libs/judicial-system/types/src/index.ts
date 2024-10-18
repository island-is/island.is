export { Feature } from './lib/feature'

export {
  Gender,
  DefenderChoice,
  SubpoenaType,
  DefendantPlea,
  ServiceRequirement,
  ServiceStatus,
  isSuccessfulServiceStatus,
} from './lib/defendant'
export { InstitutionType } from './lib/institution'
export { NotificationType } from './lib/notification'
export type { Institution } from './lib/institution'
export { EventType } from './lib/eventLog'
export { DateType } from './lib/dateLog'
export { StringType } from './lib/caseString'

export { CaseFileState, CaseFileCategory } from './lib/file'

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

export type {
  CrimeScene,
  CrimeSceneMap,
  IndictmentSubtypeMap,
} from './lib/case'

export {
  IndictmentCountOffense,
  Substance,
  offenseSubstances,
} from './lib/indictmentCount'

export { type Lawyer, mapToLawyer, AdvocateType } from './lib/advocate'

export type { SubstanceMap } from './lib/indictmentCount'

export type { CourtDocument } from './lib/courtDocument'
