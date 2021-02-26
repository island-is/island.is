export enum UserRole {
  PROSECUTOR = 'PROSECUTOR',
  REGISTRAR = 'REGISTRAR',
  JUDGE = 'JUDGE',
  ADMIN = 'ADMIN',
}

export interface Institution {
  id: string
  created: string
  modified: string
  name: string
}

export interface User {
  id: string
  created: string
  modified: string
  nationalId: string
  name: string
  title: string
  mobileNumber: string
  email: string
  role: UserRole
  institution?: Institution
  active: boolean
}

export interface CreateUser {
  nationalId: string
  name: string
  title: string
  mobileNumber: string
  email: string
  role: UserRole
  institutionId: string
  active: boolean
}

export interface UpdateUser {
  name?: string
  title?: string
  mobileNumber?: string
  email?: string
  role?: UserRole
  institutionId?: string
  active?: boolean
}

export enum CaseType {
  CUSTODY = 'CUSTODY',
  TRAVEL_BAN = 'TRAVEL_BAN',
}

export enum CaseState {
  NEW = 'NEW',
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  RECEIVED = 'RECEIVED',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  DELETED = 'DELETED',
}

export enum CaseTransition {
  OPEN = 'OPEN',
  SUBMIT = 'SUBMIT',
  RECEIVE = 'RECEIVE',
  ACCEPT = 'ACCEPT',
  REJECT = 'REJECT',
  DELETE = 'DELETE',
}

export enum CaseCustodyProvisions {
  _95_1_A = '_95_1_A', // a-lið 1. mgr. 95. gr.
  _95_1_B = '_95_1_B', // b-lið 1. mgr. 95. gr.
  _95_1_C = '_95_1_C', // c-lið 1. mgr. 95. gr.
  _95_1_D = '_95_1_D', // d-lið 1. mgr. 95. gr.
  _95_2 = '_95_2', // 2. mgr. 95. gr.
  _99_1_B = '_99_1_B', // b-lið 1. mgr. 99. gr.
  _100_1 = '_100_1', // 1. mgr. 100. gr. sml.
}

export enum CaseCustodyRestrictions {
  ISOLATION = 'ISOLATION',
  VISITAION = 'VISITAION',
  COMMUNICATION = 'COMMUNICATION',
  MEDIA = 'MEDIA',
  ALTERNATIVE_TRAVEL_BAN_REQUIRE_NOTIFICATION = 'ALTERNATIVE_TRAVEL_BAN_REQUIRE_NOTIFICATION',
  ALTERNATIVE_TRAVEL_BAN_CONFISCATE_PASSPORT = 'ALTERNATIVE_TRAVEL_BAN_CONFISCATE_PASSPORT',
}

export enum CaseAppealDecision {
  APPEAL = 'APPEAL',
  ACCEPT = 'ACCEPT',
  POSTPONE = 'POSTPONE',
}

export enum CaseGender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
}

export enum CaseDecision {
  ACCEPTING = 'ACCEPTING',
  REJECTING = 'REJECTING',
  ACCEPTING_ALTERNATIVE_TRAVEL_BAN = 'ACCEPTING_ALTERNATIVE_TRAVEL_BAN',
}

export enum AccusedPleaDecision {
  ACCEPT = 'ACCEPT',
  REJECT = 'REJECT',
}

export type Gender = 'karl' | 'kona' | 'annað'

export interface Case {
  id: string
  created: string
  modified: string
  type: CaseType
  state: CaseState
  policeCaseNumber: string
  accusedNationalId: string
  accusedName?: string
  accusedAddress?: string
  accusedGender?: CaseGender
  defenderName?: string
  defenderEmail?: string
  court?: string
  arrestDate?: string
  requestedCourtDate?: string
  requestedCustodyEndDate?: string
  otherDemands?: string
  lawsBroken?: string
  custodyProvisions?: CaseCustodyProvisions[]
  requestedCustodyRestrictions?: CaseCustodyRestrictions[]
  requestedOtherRestrictions?: string
  caseFacts?: string
  witnessAccounts?: string
  investigationProgress?: string
  legalArguments?: string
  comments?: string
  prosecutor?: User
  courtCaseNumber?: string
  courtDate?: string
  isCourtDateInThePast?: boolean
  courtRoom?: string
  courtStartTime?: string
  courtEndTime?: string
  courtAttendees?: string
  policeDemands?: string
  courtDocuments?: string[]
  accusedPleaDecision?: AccusedPleaDecision
  accusedPleaAnnouncement?: string
  litigationPresentations?: string
  ruling?: string
  decision?: CaseDecision
  custodyEndDate?: string
  isCustodyEndDateInThePast?: boolean
  custodyRestrictions?: CaseCustodyRestrictions[]
  otherRestrictions?: string
  accusedAppealDecision?: CaseAppealDecision
  accusedAppealAnnouncement?: string
  prosecutorAppealDecision?: CaseAppealDecision
  prosecutorAppealAnnouncement?: string
  judge?: User
  registrar?: User
  parentCase?: Case
  childCase?: Case
  notifications?: Notification[]
}

export enum NotificationType {
  HEADS_UP = 'HEADS_UP',
  READY_FOR_COURT = 'READY_FOR_COURT',
  COURT_DATE = 'COURT_DATE',
  RULING = 'RULING',
  REVOKED = 'REVOKED',
}

export interface Notification {
  id: string
  created: string
  caseId: string
  type: NotificationType
  condition?: string
  recipients?: string
}

export interface CreateCase {
  type: CaseType
  policeCaseNumber: string
  accusedNationalId: string
  accusedName?: string
  accusedAddress?: string
  accusedGender?: CaseGender
  defenderName?: string
  defenderEmail?: string
  court?: string
}

export interface UpdateCase {
  policeCaseNumber?: string
  accusedNationalId?: string
  accusedName?: string
  accusedAddress?: string
  accusedGender?: CaseGender
  defenderName?: string
  defenderEmail?: string
  court?: string
  arrestDate?: string
  requestedCourtDate?: string
  requestedCustodyEndDate?: string
  lawsBroken?: string
  custodyProvisions?: CaseCustodyProvisions[]
  requestedCustodyRestrictions?: CaseCustodyRestrictions[]
  caseFacts?: string
  legalArguments?: string
  comments?: string
  prosecutorId?: string
  courtCaseNumber?: string
  courtDate?: string
  courtRoom?: string
  courtStartTime?: string
  courtEndTime?: string
  courtAttendees?: string
  policeDemands?: string
  courtDocuments?: string[]
  accusedPleaDecision?: AccusedPleaDecision
  accusedPleaAnnouncement?: string
  litigationPresentations?: string
  ruling?: string
  decision?: CaseDecision
  custodyEndDate?: string
  custodyRestrictions?: CaseCustodyRestrictions[]
  otherRestrictions?: string
  accusedAppealDecision?: CaseAppealDecision
  accusedAppealAnnouncement?: string
  prosecutorAppealDecision?: CaseAppealDecision
  prosecutorAppealAnnouncement?: string
  judgeId?: string
}

export interface TransitionCase {
  modified: string
  transition: CaseTransition
}

export interface SendNotification {
  type: NotificationType
}

export interface SendNotificationResponse {
  notificationSent: boolean
}

export interface RequestSignatureResponse {
  controlCode: string
  documentToken: string
}

export interface SignatureConfirmationResponse {
  documentSigned: boolean
  code?: number
  message?: string
}

export interface CreateCustodyCourtCase {
  policeCaseNumber: string
}

export interface CreateCustodyCourtCaseResponse {
  courtCaseNumber: string
}
