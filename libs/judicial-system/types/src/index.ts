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
  Notification,
  SendNotification,
  SendNotificationResponse,
} from './lib/notification'

export { CaseFileState } from './lib/file'

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
  CreateFile,
} from './lib/file'

export { UserRole, courtRoles } from './lib/user'
export type { User, CreateUser, UpdateUser } from './lib/user'

export {
  CaseOrigin,
  CaseType,
  CaseState,
  CaseTransition,
  CaseLegalProvisions,
  CaseCustodyRestrictions,
  CaseAppealDecision,
  CaseDecision,
  SessionArrangements,
  restrictionCases,
  investigationCases,
  isRestrictionCase,
  isInvestigationCase,
  isAcceptingCaseDecision,
  completedCaseStates,
  hasCaseBeenAppealed,
  isCaseTypeWithMultipleDefendantsSupport,
} from './lib/case'
export type {
  Case,
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
