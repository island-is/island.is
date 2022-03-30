import type { Defendant } from './defendant'
import type { Institution } from './institution'
import type { Notification } from './notification'
import type { CaseFile } from './file'
import type { User } from './user'
import type { CourtDocument } from './courtDocument'

export enum CaseOrigin {
  UNKNOWN = 'UNKNOWN',
  RVG = 'RVG',
  LOKE = 'LOKE',
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
  RESTRAINING_ORDER = 'RESTRAINING_ORDER',
  ELECTRONIC_DATA_DISCOVERY_INVESTIGATION = 'ELECTRONIC_DATA_DISCOVERY_INVESTIGATION',
  VIDEO_RECORDING_EQUIPMENT = 'VIDEO_RECORDING_EQUIPMENT',
  OTHER = 'OTHER',
}

export const caseTypesWithMultipleDefendants = [
  CaseType.SEARCH_WARRANT,
  CaseType.BANKING_SECRECY_WAIVER,
  CaseType.SOUND_RECORDING_EQUIPMENT,
  CaseType.PHONE_TAPPING,
  CaseType.TRACKING_EQUIPMENT,
  CaseType.VIDEO_RECORDING_EQUIPMENT,
]

export enum CaseState {
  NEW = 'NEW',
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  RECEIVED = 'RECEIVED',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  DELETED = 'DELETED',
  DISMISSED = 'DISMISSED',
}

export enum CaseTransition {
  OPEN = 'OPEN',
  SUBMIT = 'SUBMIT',
  RECEIVE = 'RECEIVE',
  ACCEPT = 'ACCEPT',
  REJECT = 'REJECT',
  DELETE = 'DELETE',
  DISMISS = 'DISMISS',
}

/* eslint-disable @typescript-eslint/naming-convention */
export enum CaseLegalProvisions {
  _95_1_A = '_95_1_A', // a-lið 1. mgr. 95. gr.
  _95_1_B = '_95_1_B', // b-lið 1. mgr. 95. gr.
  _95_1_C = '_95_1_C', // c-lið 1. mgr. 95. gr.
  _95_1_D = '_95_1_D', // d-lið 1. mgr. 95. gr.
  _95_2 = '_95_2', // 2. mgr. 95. gr.
  _99_1_B = '_99_1_B', // b-lið 1. mgr. 99. gr.
  _100_1 = '_100_1', // 1. mgr. 100. gr. sml.
}
/* eslint-enable @typescript-eslint/naming-convention */

export enum CaseCustodyRestrictions {
  NECESSITIES = 'NECESSITIES',
  ISOLATION = 'ISOLATION',
  VISITAION = 'VISITAION',
  COMMUNICATION = 'COMMUNICATION',
  MEDIA = 'MEDIA',
  ALTERNATIVE_TRAVEL_BAN_REQUIRE_NOTIFICATION = 'ALTERNATIVE_TRAVEL_BAN_REQUIRE_NOTIFICATION',
  WORKBAN = 'WORKBAN',
}

export enum CaseAppealDecision {
  APPEAL = 'APPEAL',
  ACCEPT = 'ACCEPT',
  POSTPONE = 'POSTPONE',
  NOT_APPLICABLE = 'NOT_APPLICABLE',
}

export enum CaseDecision {
  ACCEPTING = 'ACCEPTING',
  REJECTING = 'REJECTING',
  ACCEPTING_ALTERNATIVE_TRAVEL_BAN = 'ACCEPTING_ALTERNATIVE_TRAVEL_BAN',
  ACCEPTING_PARTIALLY = 'ACCEPTING_PARTIALLY',
  DISMISSING = 'DISMISSING',
}

export enum SessionArrangements {
  ALL_PRESENT = 'ALL_PRESENT',
  ALL_PRESENT_SPOKESPERSON = 'ALL_PRESENT_SPOKESPERSON',
  PROSECUTOR_PRESENT = 'PROSECUTOR_PRESENT',
}

export interface Case {
  id: string
  created: string
  modified: string
  origin: CaseOrigin
  type: CaseType
  description?: string
  state: CaseState
  policeCaseNumber: string
  defendants?: Defendant[]
  defenderName?: string
  defenderNationalId?: string
  defenderEmail?: string
  defenderPhoneNumber?: string
  sendRequestToDefender?: boolean
  defenderIsSpokesperson?: boolean
  isHeightenedSecurityLevel?: boolean
  court?: Institution
  leadInvestigator?: string
  arrestDate?: string
  requestedCourtDate?: string
  translator?: string
  requestedValidToDate?: string
  demands?: string
  lawsBroken?: string
  legalBasis?: string
  legalProvisions?: CaseLegalProvisions[]
  requestedCustodyRestrictions?: CaseCustodyRestrictions[]
  requestedOtherRestrictions?: string
  caseFacts?: string
  legalArguments?: string
  requestProsecutorOnlySession?: boolean
  prosecutorOnlySessionRequest?: string
  comments?: string
  caseFilesComments?: string
  creatingProsecutor?: User
  prosecutor?: User
  sharedWithProsecutorsOffice?: Institution
  courtCaseNumber?: string
  sessionArrangements?: SessionArrangements
  courtDate?: string
  courtLocation?: string
  courtRoom?: string
  courtStartDate?: string
  courtEndTime?: string
  isClosedCourtHidden?: boolean
  courtAttendees?: string
  prosecutorDemands?: string
  courtDocuments?: CourtDocument[]
  sessionBookings?: string
  courtCaseFacts?: string
  introduction?: string
  courtLegalArguments?: string
  ruling?: string
  decision?: CaseDecision
  validToDate?: string
  isValidToDateInThePast?: boolean
  isCustodyIsolation?: boolean
  isolationToDate?: string
  conclusion?: string
  endOfSessionBookings?: string
  accusedAppealDecision?: CaseAppealDecision
  accusedAppealAnnouncement?: string
  prosecutorAppealDecision?: CaseAppealDecision
  prosecutorAppealAnnouncement?: string
  accusedPostponedAppealDate?: string
  prosecutorPostponedAppealDate?: string
  isAppealDeadlineExpired?: boolean
  isAppealGracePeriodExpired?: boolean
  rulingDate?: string
  initialRulingDate?: string
  registrar?: User
  judge?: User
  courtRecordSignatory?: User
  courtRecordSignatureDate?: string
  parentCase?: Case
  childCase?: Case
  notifications?: Notification[]
  caseFiles?: CaseFile[]
  caseModifiedExplanation?: string
  caseResentExplanation?: string
}

export interface CreateCase {
  type: CaseType
  description?: string
  policeCaseNumber: string
  defenderName?: string
  defenderNationalId?: string
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
  defenderName?: string
  defenderNationalId?: string
  defenderEmail?: string
  defenderPhoneNumber?: string
  sendRequestToDefender?: boolean
  defenderIsSpokesperson?: boolean
  isHeightenedSecurityLevel?: boolean
  courtId?: string
  leadInvestigator?: string
  arrestDate?: string
  requestedCourtDate?: string
  translator?: string
  requestedValidToDate?: string
  demands?: string
  lawsBroken?: string
  legalBasis?: string
  legalProvisions?: CaseLegalProvisions[]
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
  sessionArrangements?: SessionArrangements
  courtDate?: string
  courtLocation?: string
  courtRoom?: string
  courtStartDate?: string
  courtEndTime?: string
  isClosedCourtHidden?: boolean
  courtAttendees?: string
  prosecutorDemands?: string
  courtDocuments?: CourtDocument[]
  sessionBookings?: string
  courtCaseFacts?: string
  introduction?: string
  courtLegalArguments?: string
  ruling?: string
  decision?: CaseDecision
  validToDate?: string
  isCustodyIsolation?: boolean
  isolationToDate?: string
  conclusion?: string
  endOfSessionBookings?: string
  accusedAppealDecision?: CaseAppealDecision
  accusedAppealAnnouncement?: string
  prosecutorAppealDecision?: CaseAppealDecision
  prosecutorAppealAnnouncement?: string
  accusedPostponedAppealDate?: string
  prosecutorPostponedAppealDate?: string
  registrarId?: string
  judgeId?: string
  caseModifiedExplanation?: string
  caseResentExplanation?: string
}

export interface TransitionCase {
  modified: string
  transition: CaseTransition
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

export const restrictionCases = [CaseType.CUSTODY, CaseType.TRAVEL_BAN]

export const investigationCases = [
  CaseType.SEARCH_WARRANT,
  CaseType.BANKING_SECRECY_WAIVER,
  CaseType.PHONE_TAPPING,
  CaseType.TELECOMMUNICATIONS,
  CaseType.TRACKING_EQUIPMENT,
  CaseType.PSYCHIATRIC_EXAMINATION,
  CaseType.SOUND_RECORDING_EQUIPMENT,
  CaseType.AUTOPSY,
  CaseType.BODY_SEARCH,
  CaseType.INTERNET_USAGE,
  CaseType.RESTRAINING_ORDER,
  CaseType.ELECTRONIC_DATA_DISCOVERY_INVESTIGATION,
  CaseType.VIDEO_RECORDING_EQUIPMENT,
  CaseType.OTHER,
]

export function isRestrictionCase(type?: CaseType): boolean {
  return Boolean(type && restrictionCases.includes(type))
}

export function isInvestigationCase(type?: CaseType): boolean {
  return Boolean(type && investigationCases.includes(type))
}

export function isAcceptingCaseDecision(decision?: CaseDecision): boolean {
  return Boolean(decision && acceptedCaseDecisions.includes(decision))
}

export function isCaseTypeWithMultipleDefendantsSupport(caseType: CaseType) {
  return caseTypesWithMultipleDefendants.includes(caseType)
}

export const completedCaseStates = [
  CaseState.ACCEPTED,
  CaseState.REJECTED,
  CaseState.DISMISSED,
]

export const acceptedCaseDecisions = [
  CaseDecision.ACCEPTING,
  CaseDecision.ACCEPTING_PARTIALLY,
]

export function hasCaseBeenAppealed(theCase: Case): boolean {
  return (
    completedCaseStates.includes(theCase.state) &&
    (theCase.accusedAppealDecision === CaseAppealDecision.APPEAL ||
      theCase.prosecutorAppealDecision === CaseAppealDecision.APPEAL ||
      Boolean(theCase.accusedPostponedAppealDate) ||
      Boolean(theCase.prosecutorPostponedAppealDate))
  )
}
