export enum CaseOrigin {
  UNKNOWN = 'UNKNOWN',
  RVG = 'RVG',
  LOKE = 'LOKE',
}

export enum CaseType {
  // Indictment cases
  INDICTMENT = 'INDICTMENT',
  // Restriction Cases
  ADMISSION_TO_FACILITY = 'ADMISSION_TO_FACILITY',
  CUSTODY = 'CUSTODY',
  TRAVEL_BAN = 'TRAVEL_BAN',
  // Investigation Cases
  AUTOPSY = 'AUTOPSY',
  BANKING_SECRECY_WAIVER = 'BANKING_SECRECY_WAIVER',
  BODY_SEARCH = 'BODY_SEARCH',
  ELECTRONIC_DATA_DISCOVERY_INVESTIGATION = 'ELECTRONIC_DATA_DISCOVERY_INVESTIGATION',
  EXPULSION_FROM_HOME = 'EXPULSION_FROM_HOME',
  INTERNET_USAGE = 'INTERNET_USAGE',
  OTHER = 'OTHER',
  PAROLE_REVOCATION = 'PAROLE_REVOCATION',
  PHONE_TAPPING = 'PHONE_TAPPING',
  PSYCHIATRIC_EXAMINATION = 'PSYCHIATRIC_EXAMINATION',
  RESTRAINING_ORDER = 'RESTRAINING_ORDER',
  RESTRAINING_ORDER_AND_EXPULSION_FROM_HOME = 'RESTRAINING_ORDER_AND_EXPULSION_FROM_HOME',
  SEARCH_WARRANT = 'SEARCH_WARRANT',
  SOUND_RECORDING_EQUIPMENT = 'SOUND_RECORDING_EQUIPMENT',
  STATEMENT_FROM_MINOR = 'STATEMENT_FROM_MINOR',
  STATEMENT_IN_COURT = 'STATEMENT_IN_COURT',
  TELECOMMUNICATIONS = 'TELECOMMUNICATIONS',
  TRACKING_EQUIPMENT = 'TRACKING_EQUIPMENT',
  VIDEO_RECORDING_EQUIPMENT = 'VIDEO_RECORDING_EQUIPMENT',
}

export enum IndictmentSubtype {
  AGGRAVATED_ASSAULT = 'AGGRAVATED_ASSAULT',
  ALCOHOL_LAWS = 'ALCOHOL_LAWS',
  ANIMAL_PROTECTION = 'ANIMAL_PROTECTION',
  ASSAULT_LEADING_TO_DEATH = 'ASSAULT_LEADING_TO_DEATH',
  ATTEMPTED_MURDER = 'ATTEMPTED_MURDER',
  BREAKING_AND_ENTERING = 'BREAKING_AND_ENTERING',
  CHILD_PROTECTION_LAWS = 'CHILD_PROTECTION_LAWS',
  COVER_UP = 'COVER_UP',
  CUSTOMS_VIOLATION = 'CUSTOMS_VIOLATION',
  DOMESTIC_VIOLENCE = 'DOMESTIC_VIOLENCE',
  EMBEZZLEMENT = 'EMBEZZLEMENT',
  FOREIGN_NATIONALS = 'FOREIGN_NATIONALS',
  FRAUD = 'FRAUD',
  INDECENT_EXPOSURE = 'INDECENT_EXPOSURE',
  INTIMATE_RELATIONS = 'INTIMATE_RELATIONS',
  LEGAL_ENFORCEMENT_LAWS = 'LEGAL_ENFORCEMENT_LAWS',
  LOOTING = 'LOOTING',
  MAJOR_ASSAULT = 'MAJOR_ASSAULT',
  MEDICINES_OFFENSE = 'MEDICINES_OFFENSE',
  MINOR_ASSAULT = 'MINOR_ASSAULT',
  MONEY_LAUNDERING = 'MONEY_LAUNDERING',
  MURDER = 'MURDER',
  NARCOTICS_OFFENSE = 'NARCOTICS_OFFENSE',
  NAVAL_LAW_VIOLATION = 'NAVAL_LAW_VIOLATION',
  OTHER_CRIMINAL_OFFENSES = 'OTHER_CRIMINAL_OFFENSES',
  OTHER_OFFENSES = 'OTHER_OFFENSES',
  POLICE_REGULATIONS = 'POLICE_REGULATIONS',
  PROPERTY_DAMAGE = 'PROPERTY_DAMAGE',
  PUBLIC_SERVICE_VIOLATION = 'PUBLIC_SERVICE_VIOLATION',
  RAPE = 'RAPE',
  SEXUAL_OFFENSES_OTHER_THAN_RAPE = 'SEXUAL_OFFENSES_OTHER_THAN_RAPE',
  TAX_VIOLATION = 'TAX_VIOLATION',
  THEFT = 'THEFT',
  THREAT = 'THREAT',
  TRAFFIC_VIOLATION = 'TRAFFIC_VIOLATION',
  UTILITY_THEFT = 'UTILITY_THEFT',
  WEPONS_VIOLATION = 'WEPONS_VIOLATION',
  // The following are no longer used but left here for historical data integrity
  BODILY_INJURY = 'BODILY_INJURY',
}

type TIndictmentSubtype = IndictmentSubtype
type TRestrictionCaseSubtype = Exclude<CaseType, CaseType.INDICTMENT>
export type Subtype = TIndictmentSubtype | TRestrictionCaseSubtype

type CourtIndictmentSubtypes = {
  [c in TIndictmentSubtype]: string
}
type CourtRestrictionCaseSubtypes = {
  [c in TRestrictionCaseSubtype]: string | [string, string]
}

// Maps case types to subtypes in the court system
export const IndictmentCaseSubtypes: CourtIndictmentSubtypes = {
  ALCOHOL_LAWS: 'Áfengislagabrot',
  CHILD_PROTECTION_LAWS: 'Barnaverndarlög',
  INDECENT_EXPOSURE: 'Blygðunarsemisbrot',
  LEGAL_ENFORCEMENT_LAWS: 'Brot gegn lögreglulögum',
  POLICE_REGULATIONS: 'Brot gegn lögreglusamþykkt',
  INTIMATE_RELATIONS: 'Brot í nánu sambandi',
  ANIMAL_PROTECTION: 'Brot á lögum um dýravernd',
  FOREIGN_NATIONALS: 'Brot á lögum um útlendinga',
  PUBLIC_SERVICE_VIOLATION: 'Brot í opinberu starfi',
  PROPERTY_DAMAGE: 'Eignaspjöll',
  NARCOTICS_OFFENSE: 'Fíkniefnalagabrot',
  EMBEZZLEMENT: 'Fjárdráttur',
  FRAUD: 'Fjársvik',
  LOOTING: 'Gripdeild',
  OTHER_CRIMINAL_OFFENSES: 'Hegningarlagabrot önnur',
  DOMESTIC_VIOLENCE: 'Heimilisofbeldi',
  THREAT: 'Hótun',
  BREAKING_AND_ENTERING: 'Húsbrot',
  COVER_UP: 'Hylming',
  SEXUAL_OFFENSES_OTHER_THAN_RAPE: 'Kynferðisbrot önnur en nauðgun',
  MAJOR_ASSAULT: 'Líkamsárás - meiriháttar',
  MINOR_ASSAULT: 'Líkamsárás - minniháttar',
  AGGRAVATED_ASSAULT: 'Líkamsárás - sérlega hættuleg',
  ASSAULT_LEADING_TO_DEATH: 'Líkamsárás sem leiðir til dauða',
  MEDICINES_OFFENSE: 'Lyfjalög',
  MURDER: 'Manndráp',
  RAPE: 'Nauðgun',
  UTILITY_THEFT: 'Nytjastuldur',
  MONEY_LAUNDERING: 'Peningaþvætti',
  OTHER_OFFENSES: 'Sérrefsilagabrot önnur',
  NAVAL_LAW_VIOLATION: 'Siglingalagabrot',
  TAX_VIOLATION: 'Skattalagabrot',
  ATTEMPTED_MURDER: 'Tilraun til manndráps',
  CUSTOMS_VIOLATION: 'Tollalagabrot',
  TRAFFIC_VIOLATION: 'Umferðarlagabrot',
  WEPONS_VIOLATION: 'Vopnalagabrot',
  THEFT: 'Þjófnaður',
  // The following are no longer used but left here for historical data integrity
  BODILY_INJURY: 'Hegningarlagabrot önnur',
}

const RestrictionCaseSubtypes: CourtRestrictionCaseSubtypes = {
  // TODO: replace with appropriate type when it has been created in the court system
  VIDEO_RECORDING_EQUIPMENT: 'Annað',
  // 'Afhending gagna',
  // 'Afturköllun á skipun verjanda',
  OTHER: 'Annað',
  TRACKING_EQUIPMENT: 'Eftirfararbúnaður',
  TRAVEL_BAN: ['Farbann', 'Framlenging farbanns'],
  // 'Framlenging frests',
  // 'Framsalsmál',
  // 'Frestur',
  CUSTODY: ['Gæsluvarðhald', 'Framlenging gæsluvarðhalds'],
  ADMISSION_TO_FACILITY: 'Vistun á viðeigandi stofnun',
  PSYCHIATRIC_EXAMINATION: 'Geðrannsókn',
  // 'Handtaka',
  SOUND_RECORDING_EQUIPMENT: 'Hljóðupptökubúnaði komið fyrir',
  SEARCH_WARRANT: 'Húsleit',
  AUTOPSY: 'Krufning',
  // 'Lausn út öryggisgæslu',
  BODY_SEARCH: 'Leit og líkamsrannsókn',
  // 'Lögmæti rannsóknarathafna',
  RESTRAINING_ORDER: 'Nálgunarbann',
  RESTRAINING_ORDER_AND_EXPULSION_FROM_HOME: 'Nálgunarbann', // this mapping to Nálgunarbann is intended
  EXPULSION_FROM_HOME: 'Nálgunarbann og brottvísun af heimili',
  // 'Réttarstaða afplánunarfanga',
  // 'Réttarstaða gæsluvarðhaldsfanga',
  PAROLE_REVOCATION: 'Rof á reynslulausn',
  BANKING_SECRECY_WAIVER: 'Rof bankaleyndar',
  // 'Sekt vitnis',
  // 'Sektir málflytjenda',
  PHONE_TAPPING: 'Símhlerun',
  // 'Skýrslutaka brotaþola eldri en 18 ára',
  STATEMENT_FROM_MINOR: 'Skýrslutaka brotaþola yngri en 18 ára',
  STATEMENT_IN_COURT: 'Skýrslutaka fyrir dómi',
  TELECOMMUNICATIONS: 'Upplýsingar um fjarskiptasamskipti',
  INTERNET_USAGE: 'Upplýsingar um vefnotkun',
  ELECTRONIC_DATA_DISCOVERY_INVESTIGATION: 'Rannsókn á rafrænum gögnum',
}

export const courtSubtypes = {
  ...RestrictionCaseSubtypes,
  ...IndictmentCaseSubtypes,
}

export const deprecatedIndictmentSubtypes: IndictmentSubtype[] = [
  IndictmentSubtype.BODILY_INJURY,
]

export interface IndictmentSubtypeMap {
  [key: string]: IndictmentSubtype[]
}

export interface CrimeScene {
  place?: string
  date?: Date
}

export interface CrimeSceneMap {
  [key: string]: CrimeScene
}

export enum CaseState {
  NEW = 'NEW',
  DRAFT = 'DRAFT',
  WAITING_FOR_CONFIRMATION = 'WAITING_FOR_CONFIRMATION',
  SUBMITTED = 'SUBMITTED',
  RECEIVED = 'RECEIVED',
  WAITING_FOR_CANCELLATION = 'WAITING_FOR_CANCELLATION',
  COMPLETED = 'COMPLETED',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  DISMISSED = 'DISMISSED',
  DELETED = 'DELETED',
  CORRECTING = 'CORRECTING',
}

export enum IndictmentCaseState {
  DRAFT = CaseState.DRAFT,
  WAITING_FOR_CONFIRMATION = CaseState.WAITING_FOR_CONFIRMATION,
  SUBMITTED = CaseState.SUBMITTED,
  RECEIVED = CaseState.RECEIVED,
  WAITING_FOR_CANCELLATION = CaseState.WAITING_FOR_CANCELLATION,
  COMPLETED = CaseState.COMPLETED,
  DELETED = CaseState.DELETED,
  CORRECTING = CaseState.CORRECTING,
}

export enum RequestCaseState {
  NEW = CaseState.NEW,
  DRAFT = CaseState.DRAFT,
  SUBMITTED = CaseState.SUBMITTED,
  RECEIVED = CaseState.RECEIVED,
  ACCEPTED = CaseState.ACCEPTED,
  REJECTED = CaseState.REJECTED,
  DISMISSED = CaseState.DISMISSED,
  DELETED = CaseState.DELETED,
}

export enum CaseAppealState {
  APPEALED = 'APPEALED',
  RECEIVED = 'RECEIVED',
  COMPLETED = 'COMPLETED',
  WITHDRAWN = 'WITHDRAWN',
}

export enum CaseTransition {
  ACCEPT = 'ACCEPT',
  APPEAL = 'APPEAL',
  ASK_FOR_CANCELLATION = 'ASK_FOR_CANCELLATION',
  ASK_FOR_CONFIRMATION = 'ASK_FOR_CONFIRMATION',
  COMPLETE = 'COMPLETE',
  COMPLETE_APPEAL = 'COMPLETE_APPEAL',
  DELETE = 'DELETE',
  DENY_INDICTMENT = 'DENY_INDICTMENT',
  DISMISS = 'DISMISS',
  MOVE = 'MOVE',
  OPEN = 'OPEN',
  RECEIVE = 'RECEIVE',
  RECEIVE_APPEAL = 'RECEIVE_APPEAL',
  REJECT = 'REJECT',
  REOPEN = 'REOPEN',
  REOPEN_APPEAL = 'REOPEN_APPEAL',
  RETURN_INDICTMENT = 'RETURN_INDICTMENT',
  SUBMIT = 'SUBMIT',
  WITHDRAW_APPEAL = 'WITHDRAW_APPEAL',
}

export enum IndictmentCaseTransition {
  ASK_FOR_CANCELLATION = CaseTransition.ASK_FOR_CANCELLATION,
  ASK_FOR_CONFIRMATION = CaseTransition.ASK_FOR_CONFIRMATION,
  COMPLETE = CaseTransition.COMPLETE,
  DELETE = CaseTransition.DELETE,
  DENY_INDICTMENT = CaseTransition.DENY_INDICTMENT,
  MOVE = CaseTransition.MOVE,
  RECEIVE = CaseTransition.RECEIVE,
  REOPEN = CaseTransition.REOPEN,
  RETURN_INDICTMENT = CaseTransition.RETURN_INDICTMENT,
  SUBMIT = CaseTransition.SUBMIT,
}

export enum RequestCaseTransition {
  ACCEPT = CaseTransition.ACCEPT,
  APPEAL = CaseTransition.APPEAL,
  COMPLETE_APPEAL = CaseTransition.COMPLETE_APPEAL,
  DELETE = CaseTransition.DELETE,
  DISMISS = CaseTransition.DISMISS,
  MOVE = CaseTransition.MOVE,
  OPEN = CaseTransition.OPEN,
  RECEIVE = CaseTransition.RECEIVE,
  RECEIVE_APPEAL = CaseTransition.RECEIVE_APPEAL,
  REJECT = CaseTransition.REJECT,
  REOPEN = CaseTransition.REOPEN,
  REOPEN_APPEAL = CaseTransition.REOPEN_APPEAL,
  SUBMIT = CaseTransition.SUBMIT,
  WITHDRAW_APPEAL = CaseTransition.WITHDRAW_APPEAL,
}

/* eslint-disable @typescript-eslint/naming-convention */
export enum CaseLegalProvisions {
  _95_1_A = '_95_1_A', // a-lið 1. mgr. 95. gr.
  _95_1_B = '_95_1_B', // b-lið 1. mgr. 95. gr.
  _95_1_C = '_95_1_C', // c-lið 1. mgr. 95. gr.
  _95_1_D = '_95_1_D', // d-lið 1. mgr. 95. gr.
  _95_2 = '_95_2', // 2. mgr. 95. gr.
  _97_1 = '_97_1', // 1. mgr. 97. gr. sml.
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

export enum IndictmentDecision {
  COMPLETING = 'COMPLETING',
  POSTPONING = 'POSTPONING',
  POSTPONING_UNTIL_VERDICT = 'POSTPONING_UNTIL_VERDICT',
  REDISTRIBUTING = 'REDISTRIBUTING',
  SCHEDULING = 'SCHEDULING',
  SPLITTING = 'SPLITTING',
}

export enum CaseAppealRulingDecision {
  ACCEPTING = 'ACCEPTING',
  REPEAL = 'REPEAL',
  CHANGED = 'CHANGED',
  CHANGED_SIGNIFICANTLY = 'CHANGED_SIGNIFICANTLY',
  DISMISSED_FROM_COURT_OF_APPEAL = 'DISMISSED_FROM_COURT_OF_APPEAL',
  DISMISSED_FROM_COURT = 'DISMISSED_FROM_COURT',
  REMAND = 'REMAND',
  DISCONTINUED = 'DISCONTINUED',
}

export enum CaseIndictmentRulingDecision {
  RULING = 'RULING',
  FINE = 'FINE',
  DISMISSAL = 'DISMISSAL',
  CANCELLATION = 'CANCELLATION',
  MERGE = 'MERGE',
  WITHDRAWAL = 'WITHDRAWAL',
}

export enum IndictmentCaseReviewDecision {
  APPEAL = 'APPEAL',
  ACCEPT = 'ACCEPT',
}

export enum SessionArrangements {
  ALL_PRESENT = 'ALL_PRESENT',
  ALL_PRESENT_SPOKESPERSON = 'ALL_PRESENT_SPOKESPERSON',
  PROSECUTOR_PRESENT = 'PROSECUTOR_PRESENT',
  NONE_PRESENT = 'NONE_PRESENT',
}

export enum RequestSharedWithDefender {
  READY_FOR_COURT = 'READY_FOR_COURT',
  COURT_DATE = 'COURT_DATE', // TODO: Rename to ARRAIGNMENT_DATE at some point
  NOT_SHARED = 'NOT_SHARED',
}

export enum RequestSharedWhen {
  READY_FOR_COURT = 'READY_FOR_COURT',
  ARRAIGNMENT_DATE_ASSIGNED = 'ARRAIGNMENT_DATE_ASSIGNED',
  OBLIGATED = 'OBLIGATED',
}

export enum CourtSessionType {
  MAIN_HEARING = 'MAIN_HEARING',
  OTHER = 'OTHER',
  APPRAISER_SUMMONS = 'APPRAISER_SUMMONS',
  VERDICT = 'VERDICT',
  MAIN_HEARING_CONTINUATION = 'MAIN_HEARING_CONTINUATION',
  HEARING = 'HEARING',
  ORAL_ARGUMENTS = 'ORAL_ARGUMENTS',
  RULING = 'RULING',
  ARRAIGNMENT = 'ARRAIGNMENT',
}

export const courtSessionTypeNames = {
  MAIN_HEARING: 'Aðalmeðferð',
  OTHER: 'Annað',
  APPRAISER_SUMMONS: 'Dómkvaðning matsmanna',
  VERDICT: 'Dómsuppsaga',
  MAIN_HEARING_CONTINUATION: 'Framhald aðalmeðferðar',
  HEARING: 'Fyrirtaka',
  ORAL_ARGUMENTS: 'Munnlegur málflutningur',
  RULING: 'Uppkvaðning úrskurðar',
  ARRAIGNMENT: 'Þingfesting',
}

export const indictmentCases = [CaseType.INDICTMENT]

export const isIndictmentCase = (type?: string | null): boolean => {
  return Boolean(type) && indictmentCases.includes(type as CaseType)
}

export const restrictionCases = [
  CaseType.ADMISSION_TO_FACILITY,
  CaseType.CUSTODY,
  CaseType.TRAVEL_BAN,
]

export const isRestrictionCase = (type?: CaseType | null): boolean => {
  return Boolean(type && restrictionCases.includes(type))
}

export const investigationCases = [
  CaseType.AUTOPSY,
  CaseType.BANKING_SECRECY_WAIVER,
  CaseType.BODY_SEARCH,
  CaseType.ELECTRONIC_DATA_DISCOVERY_INVESTIGATION,
  CaseType.EXPULSION_FROM_HOME,
  CaseType.INTERNET_USAGE,
  CaseType.OTHER,
  CaseType.PHONE_TAPPING,
  CaseType.PAROLE_REVOCATION,
  CaseType.PSYCHIATRIC_EXAMINATION,
  CaseType.RESTRAINING_ORDER,
  CaseType.RESTRAINING_ORDER_AND_EXPULSION_FROM_HOME,
  CaseType.SEARCH_WARRANT,
  CaseType.SOUND_RECORDING_EQUIPMENT,
  CaseType.STATEMENT_FROM_MINOR,
  CaseType.STATEMENT_IN_COURT,
  CaseType.TELECOMMUNICATIONS,
  CaseType.TRACKING_EQUIPMENT,
  CaseType.VIDEO_RECORDING_EQUIPMENT,
]

export const isInvestigationCase = (type?: CaseType | null): boolean => {
  return Boolean(type && investigationCases.includes(type))
}

export const isRequestCase = (type?: CaseType | null): boolean => {
  return Boolean(type && (isRestrictionCase(type) || isInvestigationCase(type)))
}

export const acceptedCaseDecisions = [
  CaseDecision.ACCEPTING,
  CaseDecision.ACCEPTING_PARTIALLY,
]

export const isAcceptingCaseDecision = (
  decision?: CaseDecision | null,
): boolean => {
  return Boolean(decision && acceptedCaseDecisions.includes(decision))
}

export const completedRequestCaseStates = [
  CaseState.ACCEPTED,
  CaseState.REJECTED,
  CaseState.DISMISSED,
]

export const completedIndictmentCaseStates = [
  CaseState.COMPLETED,
  CaseState.CORRECTING,
]

export const completedCaseStates = completedRequestCaseStates.concat(
  completedIndictmentCaseStates,
)

export const isCompletedCase = (state?: CaseState | null): boolean => {
  return Boolean(state && completedCaseStates.includes(state))
}

export const isRulingOrDismissalCase = (
  rulingDecision?: CaseIndictmentRulingDecision | null,
) => {
  return Boolean(
    rulingDecision &&
      [
        CaseIndictmentRulingDecision.RULING,
        CaseIndictmentRulingDecision.DISMISSAL,
      ].includes(rulingDecision),
  )
}
export const hasIndictmentCaseBeenSubmittedToCourt = (
  state?: CaseState | null,
): boolean => {
  return Boolean(
    state &&
      [
        CaseState.SUBMITTED,
        CaseState.RECEIVED,
        ...completedIndictmentCaseStates,
      ].includes(state),
  )
}

export const getStatementDeadline = (appealReceived: Date): string => {
  return new Date(
    new Date(appealReceived).setDate(appealReceived.getDate() + 1),
  ).toISOString()
}

export const isIndictmentCaseState = (
  state: string,
): state is IndictmentCaseState => {
  return Object.values(IndictmentCaseState).includes(
    state as IndictmentCaseState,
  )
}

export const isRequestCaseState = (
  state: string,
): state is RequestCaseState => {
  return Object.values(RequestCaseState).includes(state as RequestCaseState)
}

export const isIndictmentCaseTransition = (
  transition: string,
): transition is IndictmentCaseTransition => {
  return Object.values(IndictmentCaseTransition).includes(
    transition as IndictmentCaseTransition,
  )
}

export const isRequestCaseTransition = (
  transition: string,
): transition is RequestCaseTransition => {
  return Object.values(RequestCaseTransition).includes(
    transition as RequestCaseTransition,
  )
}
