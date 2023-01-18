export { Feature } from './lib/feature'

export { Gender } from './lib/defendant'
export type {
  Defendant,
  CreateDefendant,
  UpdateDefendant,
  DeleteDefendantResponse,
} from './lib/defendant'

// export { InstitutionType } from './lib/institution'
export type { Institution } from './lib/institution'

export { NotificationType } from './lib/notification'
export type {
  Recipient,
  Notification,
  SendNotification,
  SendNotificationResponse,
} from './lib/notification'

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
  prosecutionRoles,
  isProsecutionRole,
  courtRoles,
  isCourtRole,
  isExtendedCourtRole,
} from './lib/user'
export type { CreateUser, UpdateUser } from './lib/user'

export {
  CaseOrigin,
  IndictmentSubtype,
  xCaseTransition,
  CaseLegalProvisions,
  CaseCustodyRestrictions,
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
  SubpoenaType,
} from './lib/case'
export type {
  Case,
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

export type { CourtDocument } from './lib/courtDocument'

export {
  UserRole,
  CaseType,
  CaseState,
  CaseDecision,
  CaseAppealDecision,
  InstitutionType,
} from './lib/graphql/schema'

export type { CaseListQuery, CaseListEntry, User } from './lib/graphql/schema'
