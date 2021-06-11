import { OptionsType, GroupedOptionsType } from 'react-select'

export enum Feature {
  NONE = 'NONE', // must be at least one
  R_CASES = 'R_CASES',
}

export enum InstitutionType {
  PROSECUTORS_OFFICE = 'PROSECUTORS_OFFICE',
  COURT = 'COURT',
}

export interface Institution {
  id: string
  created: string
  modified: string
  type: InstitutionType
  name: string
}

export const IntegratedCourts = [
  'd1e6e06f-dcfd-45e0-9a24-2fdabc2cc8bf',
  'c9a51c9a-c0e3-4c1f-a9a2-828a3af05d1d',
]

export enum UserRole {
  PROSECUTOR = 'PROSECUTOR',
  REGISTRAR = 'REGISTRAR',
  JUDGE = 'JUDGE',
  ADMIN = 'ADMIN',
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
  SEARCH_WARRANT = 'SEARCH_WARRANT',
  BANKING_SECRECY_WAIVER = 'BANKING_SECRECY_WAIVER',
  PHONE_TAPPING = 'PHONE_TAPPING',
  TELECOMMUNICATIONS = 'TELECOMMUNICATIONS',
  TRACKING_EQUIPMENT = 'TRACKING_EQUIPMENT',
  PSYCHIATRIC_EXAMINATION = 'PSYCHIATRIC_EXAMINATION',
  SOUND_RECORDING_EQUIPMENT = 'SOUND_RECORDING_EQUIPMENT',
  AUTOPSY = 'AUTOPSY',
  BODY_SEARCH = 'BODY_SEARCH',
  INTERNET_USAGE = 'INTERNET_USAGE',
  OTHER = 'OTHER',
}

export enum ReadableCaseType {
  CUSTODY = 'gæsluvarðhald',
  TRAVEL_BAN = 'farbann',
  SEARCH_WARRANT = 'húsleit',
  BANKING_SECRECY_WAIVER = 'rof bankaleyndar',
  PHONE_TAPPING = 'símhlustun',
  TELECOMMUNICATIONS = 'upplýsingar um fjarskiptasamskipti',
  TRACKING_EQUIPMENT = 'eftirfararbúnaður',
  PSYCHIATRIC_EXAMINATION = 'geðrannsókn',
  SOUND_RECORDING_EQUIPMENT = 'hljóðupptökubúnaði komið fyrir',
  AUTOPSY = 'krufning',
  BODY_SEARCH = 'leit og líkamsrannsókn',
  INTERNET_USAGE = 'upplýsingar um vefnotkun',
  OTHER = 'annað',
}

export const RCaseTypes = [
  {
    label: 'Húsleit',
    value: CaseType.SEARCH_WARRANT,
  },
  {
    label: 'Rof bankaleyndar',
    value: CaseType.BANKING_SECRECY_WAIVER,
  },
  {
    label: 'Símhlustun',
    value: CaseType.PHONE_TAPPING,
  },
  {
    label: 'Upplýsingar um fjarskiptasamskipti',
    value: CaseType.TELECOMMUNICATIONS,
  },
  {
    label: 'Eftirfararbúnaður',
    value: CaseType.TRACKING_EQUIPMENT,
  },
  {
    label: '',
    options: [
      {
        label: 'Geðrannsókn',
        value: CaseType.PSYCHIATRIC_EXAMINATION,
      },
      {
        label: 'Hljóðupptökubúnaði komið fyrir',
        value: CaseType.SOUND_RECORDING_EQUIPMENT,
      },
      {
        label: 'Krufning',
        value: CaseType.AUTOPSY,
      },
      {
        label: 'Leit og líkamsrannsókn',
        value: CaseType.BODY_SEARCH,
      },
      {
        label: 'Upplýsingar um vefnotkun',
        value: CaseType.INTERNET_USAGE,
      },
      {
        label: 'Annað',
        value: CaseType.OTHER,
      },
    ],
  },
]

const CustodyAndTravelBanTypes = [
  {
    label: 'Gæsluvarðhald',
    value: CaseType.CUSTODY,
  },
  {
    label: 'Farbann',
    value: CaseType.TRAVEL_BAN,
  },
]

export const AllCaseTypes = [
  ...RCaseTypes.slice(0, 5),
  ...(RCaseTypes[5].options || []),
  ...CustodyAndTravelBanTypes,
]

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

/* eslint-disable @typescript-eslint/naming-convention */
export enum CaseCustodyProvisions {
  _95_1_A = '_95_1_A', // a-lið 1. mgr. 95. gr.
  _95_1_B = '_95_1_B', // b-lið 1. mgr. 95. gr.
  _95_1_C = '_95_1_C', // c-lið 1. mgr. 95. gr.
  _95_1_D = '_95_1_D', // d-lið 1. mgr. 95. gr.
  _95_2 = '_95_2', // 2. mgr. 95. gr.
  _98_2 = '_98_2', // 2. mgr. 98. gr.
  _99_1_B = '_99_1_B', // b-lið 1. mgr. 99. gr.
  _100_1 = '_100_1', // 1. mgr. 100. gr. sml.
}
/* eslint-enable @typescript-eslint/naming-convention */

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
  description?: string
  state: CaseState
  policeCaseNumber: string
  accusedNationalId: string
  accusedName?: string
  accusedAddress?: string
  accusedGender?: CaseGender
  defenderName?: string
  defenderEmail?: string
  defenderPhoneNumber?: string
  sendRequestToDefender?: boolean
  court?: Institution
  leadInvestigator?: string
  arrestDate?: string
  requestedCourtDate?: string
  requestedValidToDate?: string
  demands?: string
  lawsBroken?: string
  legalBasis?: string
  custodyProvisions?: CaseCustodyProvisions[]
  requestedCustodyRestrictions?: CaseCustodyRestrictions[]
  requestedOtherRestrictions?: string
  caseFacts?: string
  legalArguments?: string
  requestProsecutorOnlySession?: boolean
  prosecutorOnlySessionRequest?: string
  comments?: string
  caseFilesComments?: string
  prosecutor?: User
  sharedWithProsecutorsOffice?: Institution
  courtCaseNumber?: string
  courtDate?: string
  courtRoom?: string
  courtStartDate?: string
  courtEndTime?: string
  courtAttendees?: string
  prosecutorDemands?: string
  courtDocuments?: string[]
  additionToConclusion?: string
  accusedPleaDecision?: AccusedPleaDecision
  accusedPleaAnnouncement?: string
  litigationPresentations?: string
  courtCaseFacts?: string
  courtLegalArguments?: string
  ruling?: string
  decision?: CaseDecision
  validToDate?: string
  isValidToDateInThePast?: boolean
  custodyRestrictions?: CaseCustodyRestrictions[]
  otherRestrictions?: string
  isolationTo?: string
  accusedAppealDecision?: CaseAppealDecision
  accusedAppealAnnouncement?: string
  prosecutorAppealDecision?: CaseAppealDecision
  prosecutorAppealAnnouncement?: string
  accusedPostponedAppealDate?: string
  prosecutorPostponedAppealDate?: string
  isAppealDeadlineExpired?: boolean
  isAppealGracePeriodExpired?: boolean
  rulingDate?: string
  registrar?: User
  judge?: User
  parentCase?: Case
  childCase?: Case
  notifications?: Notification[]
  files?: CaseFile[]
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
  description?: string
  policeCaseNumber: string
  accusedNationalId: string
  accusedName?: string
  accusedAddress?: string
  accusedGender?: CaseGender
  defenderName?: string
  defenderEmail?: string
  defenderPhoneNumber?: string
  sendRequestToDefender?: boolean
  courtId?: string
  leadInvestigator?: string
}

export interface UpdateCase {
  type?: string
  description?: string
  policeCaseNumber?: string
  accusedNationalId?: string
  accusedName?: string
  accusedAddress?: string
  accusedGender?: CaseGender
  defenderName?: string
  defenderEmail?: string
  defenderPhoneNumber?: string
  sendRequestToDefender?: boolean
  courtId?: string
  leadInvestigator?: string
  arrestDate?: string
  requestedCourtDate?: string
  requestedValidToDate?: string
  demands?: string
  lawsBroken?: string
  legalBasis?: string
  custodyProvisions?: CaseCustodyProvisions[]
  requestedCustodyRestrictions?: CaseCustodyRestrictions[]
  requestedOtherRestrictions?: string
  caseFacts?: string
  legalArguments?: string
  requestProsecutorOnlySession?: boolean
  prosecutorOnlySessionRequest?: string
  comments?: string
  caseFilesComments?: string
  prosecutorId?: string
  sharedWithProsecutorsOfficeId?: string
  courtCaseNumber?: string
  courtDate?: string
  courtRoom?: string
  courtStartDate?: string
  courtEndTime?: string
  courtAttendees?: string
  prosecutorDemands?: string
  courtDocuments?: string[]
  additionToConclusion?: string
  accusedPleaDecision?: AccusedPleaDecision
  accusedPleaAnnouncement?: string
  litigationPresentations?: string
  courtCaseFacts?: string
  courtLegalArguments?: string
  ruling?: string
  decision?: CaseDecision
  validToDate?: string
  custodyRestrictions?: CaseCustodyRestrictions[]
  otherRestrictions?: string
  isolationTo?: string
  accusedAppealDecision?: CaseAppealDecision
  accusedAppealAnnouncement?: string
  prosecutorAppealDecision?: CaseAppealDecision
  prosecutorAppealAnnouncement?: string
  accusedPostponedAppealDate?: string | null
  prosecutorPostponedAppealDate?: string
  registrarId?: string
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

export interface CreateCourtCase {
  type: CaseType
  policeCaseNumber: string
  isExtension: boolean
}

export interface PresignedPost {
  url: string
  fields: { [key: string]: string }
}

export interface CreatePresignedPost {
  fileName: string
}

export interface DeleteFile {
  id: string
}

export interface DeleteFileResponse {
  success: boolean
}

export interface GetSignedUrl {
  caseId: string
  id: string
}

export interface SignedUrl {
  url: string
}

export interface CaseFile {
  id: string
  created: string
  modified: string
  caseId: string
  name: string
  key: string
  size: number
}

export interface CreateFile {
  key: string
  size: number
}
