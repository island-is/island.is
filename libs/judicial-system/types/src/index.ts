export { Feature } from './lib/feature'

export { Gender } from './lib/defendant'
export type {
  Defendant,
  CreateDefendant,
  UpdateDefendant,
  DeleteDefendantResponse,
} from './lib/defendant'

export { InstitutionType } from './lib/institution'
export type { Institution } from './lib/institution'
export { NotificationType } from './lib/notification'
export type {
  Recipient,
  Notification,
  SendNotification,
  SendNotificationResponse,
} from './lib/notification'
export type { EventLog } from './lib/eventLog'
export { EventType } from './lib/eventLog'

export { CaseFileState, CaseFileCategory } from './lib/file'

export type {
  PresignedPost,
  CreatePresignedPost,
  DeleteFile,
  DeleteFileResponse,
  GetSignedUrl,
  SignedUrl,
  UploadFileToCourt,
  UploadFileToCourtResponse,
  CaseFile,
  UpdateFile,
  CreateFile,
} from './lib/file'

export {
  UserRole,
  prosecutionRoles,
  isProsecutionRole,
  isProsecutionUser,
  courtRoles,
  isCourtRole,
  extendedCourtRoles,
  isExtendedCourtRole,
  isDistrictCourtUser,
  appealsCourtRoles,
  isAppealsCourtUser,
  prisonSystemRoles,
  isPrisonSystemUser,
  defenceRoles,
  isDefenceUser,
} from './lib/user'
export type { User, CreateUser, UpdateUser } from './lib/user'

export {
  CaseOrigin,
  CaseType,
  IndictmentSubtype,
  CaseState,
  CaseTransition,
  CaseLegalProvisions,
  CaseCustodyRestrictions,
  CaseAppealDecision,
  CaseDecision,
  CaseAppealRulingDecision,
  RequestSharedWithDefender,
  SessionArrangements,
  restrictionCases,
  investigationCases,
  indictmentCases,
  isIndictmentCase,
  isRestrictionCase,
  isInvestigationCase,
  isAcceptingCaseDecision,
  completedCaseStates,
  hasCaseBeenAppealed,
  CaseAppealState,
  getAppealInfo,
  getStatementDeadline,
  getAppealedDate,
} from './lib/case'
export type {
  Case,
  CaseListEntry,
  CrimeScene,
  CrimeSceneMap,
  IndictmentSubtypeMap,
  CreateCase,
  UpdateCase,
  TransitionCase,
  RequestSignatureResponse,
  SignatureConfirmationResponse,
} from './lib/case'

export type {
  PoliceCaseFile,
  UploadPoliceCaseFile,
  UploadPoliceCaseFileResponse,
} from './lib/policeFile'

export {
  IndictmentCountOffense,
  Substance,
  offenseSubstances,
} from './lib/indictmentCount'

export { type LawyerFull, type Lawyer, mapToLawyer } from './lib/defender'

export type { SubstanceMap } from './lib/indictmentCount'

export type { CourtDocument } from './lib/courtDocument'
