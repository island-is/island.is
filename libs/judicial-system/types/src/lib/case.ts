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
  // Indictment cases
  CHILD_PROTECTION_LAWS = 'CHILD_PROTECTION_LAWS',
  PROPERTY_DAMAGE = 'PROPERTY_DAMAGE',
  NARCOTICS_OFFENSE = 'NARCOTICS_OFFENSE',
  EMBEZZLEMENT = 'EMBEZZLEMENT',
  FRAUD = 'FRAUD',
  DOMESTIC_VIOLENCE = 'DOMESTIC_VIOLENCE',
  ASSAULT_LEADING_TO_DEATH = 'ASSAULT_LEADING_TO_DEATH',
  MURDER = 'MURDER',
  MAJOR_ASSAULT = 'MAJOR_ASSAULT',
  MINOR_ASSAULT = 'MINOR_ASSAULT',
  RAPE = 'RAPE',
  UTILITY_THEFT = 'UTILITY_THEFT',
  AGGRAVATED_ASSAULT = 'AGGRAVATED_ASSAULT',
  TAX_VIOLATION = 'TAX_VIOLATION',
  ATTEMPTED_MURDER = 'ATTEMPTED_MURDER',
  TRAFFIC_VIOLATION = 'TRAFFIC_VIOLATION',
  THEFT = 'THEFT',
  OTHER_CRIMINAL_OFFENSES = 'OTHER_CRIMINAL_OFFENSES',
  SEXUAL_OFFENSES_OTHER_THAN_RAPE = 'SEXUAL_OFFENSES_OTHER_THAN_RAPE',
  OTHER_OFFENSES = 'OTHER_OFFENSES',
  // Restriction Cases
  CUSTODY = 'CUSTODY',
  TRAVEL_BAN = 'TRAVEL_BAN',
  ADMISSION_TO_FACILITY = 'ADMISSION_TO_FACILITY',
  // Investigation Cases
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
  RESTRAINING_ORDER_AND_EXPULSION_FROM_HOME = 'RESTRAINING_ORDER_AND_EXPULSION_FROM_HOME',
  EXPULSION_FROM_HOME = 'EXPULSION_FROM_HOME',
  ELECTRONIC_DATA_DISCOVERY_INVESTIGATION = 'ELECTRONIC_DATA_DISCOVERY_INVESTIGATION',
  VIDEO_RECORDING_EQUIPMENT = 'VIDEO_RECORDING_EQUIPMENT',
  OTHER = 'OTHER',
}

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

export enum SubpoenaType {
  ARREST_SUMMONS = 'ARREST_SUMMONS',
  ABSENCE_SUMMONS = 'ABSENCE_SUMMONS',
}

export interface Case {
  id: string
  created: string
  modified: string
  origin: CaseOrigin
  type: CaseType
  description?: string
  state: CaseState
  policeCaseNumbers: string[]
  defendants?: Defendant[]
  defenderName?: string
  defenderNationalId?: string
  defenderEmail?: string
  defenderPhoneNumber?: string
  sendRequestToDefender?: boolean
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
  rulingModifiedHistory?: string
  caseResentExplanation?: string
  seenByDefender?: string
  subpoenaType?: SubpoenaType
  defendantWaivesRightToCounsel: boolean
}

export type CreateCase = Pick<
  Case,
  | 'type'
  | 'description'
  | 'policeCaseNumbers'
  | 'defenderName'
  | 'defenderNationalId'
  | 'defenderEmail'
  | 'defenderPhoneNumber'
  | 'sendRequestToDefender'
  | 'leadInvestigator'
>

export interface UpdateCase
  extends Pick<
    Case,
    | 'description'
    | 'defenderName'
    | 'defenderNationalId'
    | 'defenderEmail'
    | 'defenderPhoneNumber'
    | 'sendRequestToDefender'
    | 'isHeightenedSecurityLevel'
    | 'leadInvestigator'
    | 'arrestDate'
    | 'requestedCourtDate'
    | 'translator'
    | 'requestedValidToDate'
    | 'demands'
    | 'lawsBroken'
    | 'legalBasis'
    | 'legalProvisions'
    | 'requestedCustodyRestrictions'
    | 'requestedOtherRestrictions'
    | 'caseFacts'
    | 'legalArguments'
    | 'requestProsecutorOnlySession'
    | 'prosecutorOnlySessionRequest'
    | 'comments'
    | 'caseFilesComments'
    | 'courtCaseNumber'
    | 'sessionArrangements'
    | 'courtDate'
    | 'courtLocation'
    | 'courtRoom'
    | 'courtStartDate'
    | 'courtEndTime'
    | 'isClosedCourtHidden'
    | 'courtAttendees'
    | 'prosecutorDemands'
    | 'courtDocuments'
    | 'sessionBookings'
    | 'courtCaseFacts'
    | 'introduction'
    | 'courtLegalArguments'
    | 'ruling'
    | 'decision'
    | 'validToDate'
    | 'isCustodyIsolation'
    | 'isolationToDate'
    | 'conclusion'
    | 'endOfSessionBookings'
    | 'accusedAppealDecision'
    | 'accusedAppealAnnouncement'
    | 'prosecutorAppealDecision'
    | 'prosecutorAppealAnnouncement'
    | 'accusedPostponedAppealDate'
    | 'prosecutorPostponedAppealDate'
    | 'caseModifiedExplanation'
    | 'rulingModifiedHistory'
    | 'caseResentExplanation'
    | 'seenByDefender'
    | 'subpoenaType'
  > {
  type?: CaseType
  state?: CaseState
  policeCaseNumbers?: string[]
  courtId?: string
  prosecutorId?: string
  sharedWithProsecutorsOfficeId?: string | null
  registrarId?: string | null
  judgeId?: string
  defendantWaivesRightToCounsel?: boolean
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

export const indictmentCases = [
  CaseType.CHILD_PROTECTION_LAWS,
  CaseType.PROPERTY_DAMAGE,
  CaseType.NARCOTICS_OFFENSE,
  CaseType.EMBEZZLEMENT,
  CaseType.FRAUD,
  CaseType.DOMESTIC_VIOLENCE,
  CaseType.ASSAULT_LEADING_TO_DEATH,
  CaseType.MURDER,
  CaseType.MAJOR_ASSAULT,
  CaseType.MINOR_ASSAULT,
  CaseType.RAPE,
  CaseType.UTILITY_THEFT,
  CaseType.AGGRAVATED_ASSAULT,
  CaseType.TAX_VIOLATION,
  CaseType.ATTEMPTED_MURDER,
  CaseType.TRAFFIC_VIOLATION,
  CaseType.THEFT,
  CaseType.OTHER_CRIMINAL_OFFENSES,
  CaseType.SEXUAL_OFFENSES_OTHER_THAN_RAPE,
  CaseType.OTHER_OFFENSES,
]

export const restrictionCases = [
  CaseType.CUSTODY,
  CaseType.TRAVEL_BAN,
  CaseType.ADMISSION_TO_FACILITY,
]

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
  CaseType.RESTRAINING_ORDER_AND_EXPULSION_FROM_HOME,
  CaseType.EXPULSION_FROM_HOME,
  CaseType.ELECTRONIC_DATA_DISCOVERY_INVESTIGATION,
  CaseType.VIDEO_RECORDING_EQUIPMENT,
  CaseType.OTHER,
]

export function isIndictmentCase(type?: CaseType): boolean {
  return Boolean(type && indictmentCases.includes(type))
}

export function isRestrictionCase(type?: CaseType): boolean {
  return Boolean(type && restrictionCases.includes(type))
}

export function isInvestigationCase(type?: CaseType): boolean {
  return Boolean(type && investigationCases.includes(type))
}

export function isAcceptingCaseDecision(decision?: CaseDecision): boolean {
  return Boolean(decision && acceptedCaseDecisions.includes(decision))
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
