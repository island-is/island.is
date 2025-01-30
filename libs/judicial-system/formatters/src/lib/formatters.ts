import { format, isValid, parseISO } from 'date-fns' // eslint-disable-line no-restricted-imports
// Importing 'is' directly from date-fns/locale/is has caused unexpected problems
import { is } from 'date-fns/locale' // eslint-disable-line no-restricted-imports
import _uniq from 'lodash/uniq'

import {
  CaseAppealDecision,
  CaseAppealRulingDecision,
  CaseCustodyRestrictions,
  CaseIndictmentRulingDecision,
  CaseType,
  Gender,
  IndictmentSubtype,
  IndictmentSubtypeMap,
  isRestrictionCase,
} from '@island.is/judicial-system/types'

const getAsDate = (date: Date | string | undefined | null): Date => {
  if (typeof date === 'string' || date instanceof String) {
    return parseISO(date as string)
  } else {
    return date as Date
  }
}

export const formatDate = (
  date: Date | string | undefined | null,
  formatPattern = 'dd.MM.yyyy',
  shortenDayName?: boolean,
): string | undefined => {
  const theDate: Date = getAsDate(date)

  if (isValid(theDate)) {
    const formattedDate = format(theDate, formatPattern, {
      locale: is,
    })

    if (shortenDayName) {
      return formattedDate.replace('dagur,', 'd.')
    } else {
      return formattedDate
    }
  } else {
    return undefined
  }
}

// Credit: https://dzone.com/articles/capitalize-first-letter-string-javascript
export const capitalize = (text?: string | null): string => {
  if (!text) {
    return ''
  }

  return text.charAt(0).toUpperCase() + text.slice(1)
}

export const lowercase = (text?: string | null): string => {
  if (!text) {
    return ''
  }

  return text.charAt(0).toLowerCase() + text.slice(1)
}

export const formatNationalId = (nationalId?: string | null): string => {
  if (!nationalId) {
    return ''
  }

  const regex = new RegExp(/^\d{10}$/)

  if (regex.test(nationalId)) {
    return `${nationalId.slice(0, 6)}-${nationalId.slice(6)}`
  } else {
    return nationalId
  }
}

export const normalizeAndFormatNationalId = (
  nationalId?: string | null,
): [string, string] => {
  return [nationalId?.replace(/-/g, '') ?? '', formatNationalId(nationalId)]
}

export const getInitials = (name?: string | null): string | undefined => {
  if (!name?.trim()) return undefined

  const names = name.trim().split(' ')
  const initials =
    names.length > 1
      ? `${names[0][0]}${names[names.length - 1][0]}`
      : names[0][0]

  return initials.toUpperCase()
}

export const formatPhoneNumber = (phoneNumber?: string | null) => {
  if (!phoneNumber) {
    return
  }

  const value = phoneNumber.replace('-', '')

  const splitAt = (index: number) => (x: string) =>
    [x.slice(0, index), x.slice(index)]
  if (value.length > 3) return splitAt(3)(value).join('-')
  return value
}

export const laws = {
  _95_1_A: 'a-lið 1. mgr. 95. gr. sml.',
  _95_1_B: 'b-lið 1. mgr. 95. gr. sml.',
  _95_1_C: 'c-lið 1. mgr. 95. gr. sml.',
  _95_1_D: 'd-lið 1. mgr. 95. gr. sml.',
  _95_2: '2. mgr. 95. gr. sml.',
  _97_1: '1. mgr. 97. gr. sml.',
  _99_1_B: 'b-lið 1. mgr. 99. gr. sml.',
  _100_1: '1. mgr. 100. gr. sml.',
}

export const getHumanReadableCaseIndictmentRulingDecision = (
  rulingDecision?: CaseIndictmentRulingDecision,
) => {
  switch (rulingDecision) {
    case CaseIndictmentRulingDecision.RULING:
      return 'Dómur'
    case CaseIndictmentRulingDecision.FINE:
      return 'Viðurlagaákvörðun'
    case CaseIndictmentRulingDecision.DISMISSAL:
      return 'Frávísun'
    case CaseIndictmentRulingDecision.CANCELLATION:
      return 'Niðurfelling máls'
    case CaseIndictmentRulingDecision.MERGE:
      return 'Sameinað'
    case CaseIndictmentRulingDecision.WITHDRAWAL:
      return 'Afturkallað'
    default:
      return 'Ekki skráð'
  }
}

type CaseTypes = { [c in CaseType]: string }
const caseTypes: CaseTypes = {
  // Indictment cases
  INDICTMENT: 'ákæra',
  // Restriction cases
  CUSTODY: 'gæsluvarðhald',
  TRAVEL_BAN: 'farbann',
  ADMISSION_TO_FACILITY: 'vistun á viðeigandi stofnun',
  // Investigation Cases
  SEARCH_WARRANT: 'húsleit',
  BANKING_SECRECY_WAIVER: 'rof bankaleyndar',
  PHONE_TAPPING: 'símhlustun',
  PAROLE_REVOCATION: 'rof á reynslulausn',
  TELECOMMUNICATIONS: 'upplýsingar um fjarskiptasamskipti',
  TRACKING_EQUIPMENT: 'eftirfararbúnaður',
  PSYCHIATRIC_EXAMINATION: 'geðrannsókn',
  SOUND_RECORDING_EQUIPMENT: 'hljóðupptökubúnaði komið fyrir',
  AUTOPSY: 'krufning',
  BODY_SEARCH: 'leit og líkamsrannsókn',
  INTERNET_USAGE: 'upplýsingar um vefnotkun',
  RESTRAINING_ORDER: 'nálgunarbann',
  RESTRAINING_ORDER_AND_EXPULSION_FROM_HOME:
    'nálgunarbann og brottvísun af heimili',
  EXPULSION_FROM_HOME: 'brottvísun af heimili',
  ELECTRONIC_DATA_DISCOVERY_INVESTIGATION: 'rannsókn á rafrænum gögnum',
  VIDEO_RECORDING_EQUIPMENT: 'myndupptökubúnaði komið fyrir',
  OTHER: 'annað',
}

export const formatCaseType = (type?: CaseType | null): string => {
  if (!type) {
    return 'óþekkt'
  }

  return caseTypes[type]
}

type IndictmentSubtypes = { [c in IndictmentSubtype]: string }
export const indictmentSubtypes: IndictmentSubtypes = {
  ALCOHOL_LAWS: 'áfengislagabrot',
  CHILD_PROTECTION_LAWS: 'barnaverndarlög',
  INDECENT_EXPOSURE: 'blygðunarsemisbrot',
  LEGAL_ENFORCEMENT_LAWS: 'brot gegn lögreglulögum',
  POLICE_REGULATIONS: 'brot gegn lögreglusamþykkt',
  INTIMATE_RELATIONS: 'brot í nánu sambandi',
  ANIMAL_PROTECTION: 'brot á lögum um dýravernd',
  FOREIGN_NATIONALS: 'brot á lögum um útlendinga',
  PUBLIC_SERVICE_VIOLATION: 'brot í opinberu starfi',
  PROPERTY_DAMAGE: 'eignaspjöll',
  NARCOTICS_OFFENSE: 'fíkniefnalagabrot',
  EMBEZZLEMENT: 'fjárdráttur',
  FRAUD: 'fjársvik',
  LOOTING: 'gripdeild',
  OTHER_CRIMINAL_OFFENSES: 'hegningarlagabrot önnur',
  DOMESTIC_VIOLENCE: 'heimilisofbeldi',
  THREAT: 'hótun',
  BREAKING_AND_ENTERING: 'húsbrot',
  COVER_UP: 'hylming',
  SEXUAL_OFFENSES_OTHER_THAN_RAPE: 'kynferðisbrot önnur en nauðgun',
  MAJOR_ASSAULT: 'líkamsárás - meiriháttar',
  MINOR_ASSAULT: 'líkamsárás - minniháttar',
  AGGRAVATED_ASSAULT: 'líkamsárás - sérlega hættuleg',
  ASSAULT_LEADING_TO_DEATH: 'líkamsárás sem leiðir til dauða',
  BODILY_INJURY: 'líkamsmeiðingar',
  MEDICINES_OFFENSE: 'lyfjalög',
  MURDER: 'manndráp',
  RAPE: 'nauðgun',
  UTILITY_THEFT: 'nytjastuldur',
  MONEY_LAUNDERING: 'peningaþvætti',
  OTHER_OFFENSES: 'sérrefsilagabrot önnur',
  NAVAL_LAW_VIOLATION: 'siglingalagabrot',
  TAX_VIOLATION: 'skattalagabrot',
  ATTEMPTED_MURDER: 'tilraun til manndráps',
  CUSTOMS_VIOLATION: 'tollalagabrot',
  TRAFFIC_VIOLATION: 'umferðarlagabrot',
  WEPONS_VIOLATION: 'vopnalagabrot',
  THEFT: 'þjófnaður',
}

export const districtCourtAbbreviation = (courtName?: string | null) => {
  switch (courtName) {
    case 'Héraðsdómur Reykjavíkur':
      return 'HDR'
    case 'Héraðsdómur Reykjaness':
      return 'HDRN'
    case 'Héraðsdómur Vesturlands':
      return 'HDV'
    case 'Héraðsdómur Suðurlands':
      return 'HDS'
    case 'Héraðsdómur Norðurlands eystra':
      return 'HDNE'
    case 'Héraðsdómur Norðurlands vestra':
      return 'HDNV'
    case 'Héraðsdómur Austurlands':
      return 'HDA'
    case 'Héraðsdómur Vestfjarða':
      return 'HDVF'
    default:
      return ''
  }
}

export const getAppealResultTextByValue = (
  value?: CaseAppealRulingDecision | null,
) => {
  switch (value) {
    case CaseAppealRulingDecision.ACCEPTING:
      return 'Staðfest'
    case CaseAppealRulingDecision.REPEAL:
      return 'Fellt úr gildi'
    case CaseAppealRulingDecision.CHANGED:
    case CaseAppealRulingDecision.CHANGED_SIGNIFICANTLY:
      return 'Breytt'
    case CaseAppealRulingDecision.DISMISSED_FROM_COURT_OF_APPEAL:
    case CaseAppealRulingDecision.DISMISSED_FROM_COURT:
      return 'Frávísun'
    case CaseAppealRulingDecision.REMAND:
      return 'Heimvísun'
    case CaseAppealRulingDecision.DISCONTINUED:
      return 'Niðurfellt'
    default:
      return 'Niðurstaða'
  }
}

export const getShortRestrictionByValue = (value: CaseCustodyRestrictions) => {
  switch (value) {
    case CaseCustodyRestrictions.COMMUNICATION:
      return 'Bréfskoðun, símabann'
    case CaseCustodyRestrictions.ISOLATION:
      return 'Einangrun'
    case CaseCustodyRestrictions.MEDIA:
      return 'Fjölmiðlabann'
    case CaseCustodyRestrictions.VISITAION:
      return 'Heimsóknarbann'
    case CaseCustodyRestrictions.ALTERNATIVE_TRAVEL_BAN_REQUIRE_NOTIFICATION:
      return 'Tilkynningarskylda'
    case CaseCustodyRestrictions.NECESSITIES:
      return 'Eigin nauðsynjar'
    case CaseCustodyRestrictions.WORKBAN:
      return 'Vinnubann'
  }
}

/**
 * Enumerates a list of string, f.x
 * enumerate(['alice', 'bob', 'paul'], 'and'), returns "alice, bob and paul"
 * @param values list of strings to enumerate
 * @param endWord the word before last value is enumerated
 */
export const enumerate = (values: string[], endWord: string): string => {
  return values.join(', ').replace(/, ([^,]*)$/, ` ${endWord} $1`)
}

type SupportedCaseCustodyRestriction = {
  id: string
  type:
    | CaseCustodyRestrictions.NECESSITIES
    | CaseCustodyRestrictions.VISITAION
    | CaseCustodyRestrictions.COMMUNICATION
    | CaseCustodyRestrictions.MEDIA
    | CaseCustodyRestrictions.WORKBAN
}

const supportedCaseCustodyRestrictions: SupportedCaseCustodyRestriction[] = [
  { id: 'a', type: CaseCustodyRestrictions.NECESSITIES },
  { id: 'c', type: CaseCustodyRestrictions.VISITAION },
  { id: 'd', type: CaseCustodyRestrictions.COMMUNICATION },
  { id: 'e', type: CaseCustodyRestrictions.MEDIA },
  { id: 'f', type: CaseCustodyRestrictions.WORKBAN },
]

export const getSupportedCaseCustodyRestrictions = (
  requestedRestrictions?: CaseCustodyRestrictions[] | null,
): SupportedCaseCustodyRestriction[] => {
  const restrictions = supportedCaseCustodyRestrictions.filter((restriction) =>
    requestedRestrictions?.includes(restriction.type),
  )

  if (!restrictions || restrictions.length === 0) {
    return [] as SupportedCaseCustodyRestriction[]
  }

  return restrictions.sort((a, b) => (a.id > b.id ? 1 : -1))
}

export const formatGender = (gender?: Gender): string => {
  switch (gender) {
    case Gender.MALE:
      return 'Karl'
    case Gender.FEMALE:
      return 'Kona'
    case Gender.OTHER:
    default:
      return 'Kynsegin/Annað'
  }
}

export const formatAppeal = (
  appealDecision: CaseAppealDecision | undefined | null,
  stakeholder: string,
): string => {
  const isMultipleDefendants = stakeholder.slice(-2) === 'ar'

  switch (appealDecision) {
    case CaseAppealDecision.APPEAL:
      return `${stakeholder} ${
        isMultipleDefendants ? 'lýsa' : 'lýsir'
      } því yfir að ${
        isMultipleDefendants ? 'þeir' : 'hann'
      } kæri úrskurðinn til Landsréttar.`
    case CaseAppealDecision.ACCEPT:
      return `${stakeholder} ${
        isMultipleDefendants ? 'una' : 'unir'
      } úrskurðinum.`
    case CaseAppealDecision.POSTPONE:
      return `${stakeholder} ${
        isMultipleDefendants ? 'lýsa' : 'lýsir'
      } því yfir að ${
        isMultipleDefendants ? 'þeir' : 'hann'
      } taki sér lögbundinn kærufrest.`
    default:
      return ''
  }
}

export const formatRequestCaseType = (type?: string | null): string => {
  if (!type) {
    return 'óþekkt'
  }

  const caseType = type as CaseType

  return isRestrictionCase(caseType) ||
    caseType === CaseType.RESTRAINING_ORDER ||
    caseType === CaseType.RESTRAINING_ORDER_AND_EXPULSION_FROM_HOME ||
    caseType === CaseType.EXPULSION_FROM_HOME ||
    caseType === CaseType.PSYCHIATRIC_EXAMINATION
    ? formatCaseType(caseType)
    : 'rannsóknarheimild'
}

export const formatDOB = (
  nationalId?: string | null,
  noNationalId?: boolean | null,
  fallback = '-',
) => {
  if (!nationalId) {
    return fallback
  }

  return noNationalId
    ? `fd. ${nationalId}`
    : `kt. ${formatNationalId(nationalId)}`
}

/** Displays the first element in a list followed by a number indicating
 *  how many elements are left
 *  fx. displayFirstPlusRemaining(['apple', 'pear', 'orange']) => 'apple +2'
 */
export const displayFirstPlusRemaining = (
  list: string[] | undefined | null,
) => {
  if (!list || list.length === 0) {
    return ''
  }

  if (list.length === 1) {
    return list[0]
  }

  return `${list[0]} +${list.length - 1}`
}

export const splitStringByComma = (str?: string): string[] => {
  return str?.trim().split(/[, ]+/) || []
}

export const readableIndictmentSubtypes = (
  policeCaseNumbers?: string[] | null,
  rawIndictmentSubtypes?: IndictmentSubtypeMap,
): string[] => {
  if (!policeCaseNumbers || !rawIndictmentSubtypes) {
    return []
  }

  const returnValue: string[] = []

  for (let i = 0; i < policeCaseNumbers.length; i++) {
    const subtypesOfPoliceCaseNumber =
      rawIndictmentSubtypes[policeCaseNumbers[i]]

    if (!subtypesOfPoliceCaseNumber) {
      break
    }

    returnValue.push(
      ...subtypesOfPoliceCaseNumber.map(
        (subtype) => indictmentSubtypes[subtype],
      ),
    )
  }

  return _uniq(returnValue)
}

export const sanitize = (str: string) => {
  return str.replace(/"/g, '')
}

export enum Word {
  AKAERDI = 'AKAERDI',
}
export const getWordByGender = (word: Word, gender?: Gender): string | null => {
  switch (word) {
    case Word.AKAERDI:
      return gender === Gender.MALE
        ? 'ákærði'
        : gender === Gender.FEMALE
        ? 'ákærða'
        : 'ákært'
    default:
      return null
  }
}

// þgf to dómur
export const applyDativeCaseToCourtName = (courtName: string) => {
  const target = 'dómur'
  if (courtName.includes(target)) {
    return courtName?.replace(target, 'dómi')
  }
  return courtName
}
