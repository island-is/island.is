import { format, parseISO, isValid } from 'date-fns' // eslint-disable-line no-restricted-imports
// Importing 'is' directly from date-fns/locale/is has caused unexpected problems
import { is } from 'date-fns/locale' // eslint-disable-line no-restricted-imports

import {
  CaseAppealDecision,
  CaseCustodyRestrictions,
  Gender,
  CaseType,
  isRestrictionCase,
} from '@island.is/judicial-system/types'

const getAsDate = (date: Date | string | undefined | null): Date => {
  if (typeof date === 'string' || date instanceof String) {
    return parseISO(date as string)
  } else {
    return date as Date
  }
}

export function formatDate(
  date: Date | string | undefined,
  formatPattern: string,
  shortenDayName?: boolean,
): string | undefined {
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
export const capitalize = (text: string): string => {
  if (!text) {
    return ''
  }

  return text.charAt(0).toUpperCase() + text.slice(1)
}

export const lowercase = (text?: string): string => {
  if (!text) {
    return ''
  }

  return text.charAt(0).toLowerCase() + text.slice(1)
}

export const formatNationalId = (nationalId: string): string => {
  const regex = new RegExp(/^\d{10}$/)
  if (regex.test(nationalId)) {
    return `${nationalId.slice(0, 6)}-${nationalId.slice(6)}`
  } else {
    return nationalId
  }
}

export const laws = {
  _95_1_A: 'a-lið 1. mgr. 95. gr. sml.',
  _95_1_B: 'b-lið 1. mgr. 95. gr. sml.',
  _95_1_C: 'c-lið 1. mgr. 95. gr. sml.',
  _95_1_D: 'd-lið 1. mgr. 95. gr. sml.',
  _95_2: '2. mgr. 95. gr. sml.',
  _99_1_B: 'b-lið 1. mgr. 99. gr. sml.',
  _100_1: '1. mgr. 100. gr. sml.',
}

type CaseTypes = { [c in CaseType]: string }
export const caseTypes: CaseTypes = {
  CUSTODY: 'gæsluvarðhald',
  TRAVEL_BAN: 'farbann',
  ADMISSION_TO_FACILITY: 'vistun á viðeigandi stofnun',
  SEARCH_WARRANT: 'húsleit',
  BANKING_SECRECY_WAIVER: 'rof bankaleyndar',
  PHONE_TAPPING: 'símhlustun',
  TELECOMMUNICATIONS: 'upplýsingar um fjarskiptasamskipti',
  TRACKING_EQUIPMENT: 'eftirfararbúnaður',
  PSYCHIATRIC_EXAMINATION: 'geðrannsókn',
  SOUND_RECORDING_EQUIPMENT: 'hljóðupptökubúnaði komið fyrir',
  AUTOPSY: 'krufning',
  BODY_SEARCH: 'leit og líkamsrannsókn',
  INTERNET_USAGE: 'upplýsingar um vefnotkun',
  RESTRAINING_ORDER: 'nálgunarbann',
  ELECTRONIC_DATA_DISCOVERY_INVESTIGATION: 'rannsókn á rafrænum gögnum',
  VIDEO_RECORDING_EQUIPMENT: 'myndupptökubúnaði komið fyrir',
  OTHER: 'annað',
}

const getRestrictionByValue = (value: CaseCustodyRestrictions) => {
  switch (value) {
    case CaseCustodyRestrictions.COMMUNICATION:
      return 'D - Bréfskoðun, símabann'
    case CaseCustodyRestrictions.ISOLATION:
      return 'B - Einangrun'
    case CaseCustodyRestrictions.MEDIA:
      return 'E - Fjölmiðlabann'
    case CaseCustodyRestrictions.VISITAION:
      return 'C - Heimsóknarbann'
    case CaseCustodyRestrictions.ALTERNATIVE_TRAVEL_BAN_REQUIRE_NOTIFICATION:
      return 'Tilkynningaskylda'
    case CaseCustodyRestrictions.NECESSITIES:
      return 'A - Eigin nauðsynjar'
    case CaseCustodyRestrictions.WORKBAN:
      return 'F - Vinnubann'
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

// Formats prefilled restrictions
// Note that only the predetermined list of restrictions is relevant here
export function formatCustodyRestrictions(
  requestedCustodyRestrictions?: CaseCustodyRestrictions[],
  isCustodyIsolation?: boolean,
  isRuling?: boolean,
): string {
  const caseCustodyRestrictions = [
    {
      id: 'a',
      type: CaseCustodyRestrictions.NECESSITIES,
      shortText: 'banni við útvegun persónulegra nauðsynja',
    },
    {
      id: 'c',
      type: CaseCustodyRestrictions.VISITAION,
      shortText: 'heimsóknarbanni',
    },
    {
      id: 'd',
      type: CaseCustodyRestrictions.COMMUNICATION,
      shortText: 'bréfaskoðun og símabanni',
    },
    {
      id: 'e',
      type: CaseCustodyRestrictions.MEDIA,
      shortText: 'fjölmiðlabanni',
    },
    {
      id: 'f',
      type: CaseCustodyRestrictions.WORKBAN,
      shortText: 'vinnubanni',
    },
  ]

  const relevantCustodyRestrictions = caseCustodyRestrictions
    .filter((restriction) =>
      requestedCustodyRestrictions?.includes(restriction.type),
    )
    .sort((a, b) => {
      return a.id > b.id ? 1 : -1
    })

  if (
    !(relevantCustodyRestrictions && relevantCustodyRestrictions.length > 0)
  ) {
    return !isRuling
      ? isCustodyIsolation
        ? 'Sækjandi tekur fram að gæsluvarðhaldið verði án annarra takmarkana.'
        : 'Sækjandi tekur fram að gæsluvarðhaldið verði án takmarkana.'
      : ''
  }

  const custodyRestrictionSuffix = (index: number): string => {
    const isNextLast = index === relevantCustodyRestrictions.length - 2
    const isLast = index === relevantCustodyRestrictions.length - 1
    const isOnly = relevantCustodyRestrictions.length === 1

    return isRuling && isOnly
      ? 'lið '
      : isRuling && isLast
      ? 'liðum '
      : isLast
      ? ' '
      : isNextLast && !isOnly
      ? ' og '
      : ', '
  }

  const filteredCustodyRestrictionsAsString = relevantCustodyRestrictions.reduce(
    (res, custodyRestriction, index) => {
      const { id, shortText } = custodyRestriction
      const suffix = custodyRestrictionSuffix(index)

      return (res += isRuling ? `${id}-${suffix}` : `${shortText}${suffix}`)
    },
    '',
  )

  return isRuling
    ? `Sækjandi kynnir kærða tilhögun gæsluvarðhaldsins, sem sé með takmörkunum skv. ${filteredCustodyRestrictionsAsString}1. mgr. 99. gr. laga nr. 88/2008.`
    : `Sækjandi tekur fram að gæsluvarðhaldið verði með ${filteredCustodyRestrictionsAsString}skv. 99. gr. laga nr. 88/2008.`
}

// Formats the requested restrictions from the prosecutor
export const formatRequestedCustodyRestrictions = (
  type: CaseType,
  requestedCustodyRestrictions?: CaseCustodyRestrictions[],
  requestedOtherRestrictions?: string,
) => {
  const hasRequestedCustodyRestrictions =
    requestedCustodyRestrictions && requestedCustodyRestrictions?.length > 0
  const hasRequestedOtherRestrictions =
    requestedOtherRestrictions && requestedOtherRestrictions?.length > 0

  // No restrictions
  if (!hasRequestedCustodyRestrictions && !hasRequestedOtherRestrictions) {
    return `Ekki er farið fram á takmarkanir á ${
      type === CaseType.CUSTODY ? 'gæslu' : 'farbanni'
    }.`
  }

  const requestedCustodyRestrictionsText = hasRequestedCustodyRestrictions
    ? requestedCustodyRestrictions &&
      requestedCustodyRestrictions.reduce(
        (acc, restriction, index) =>
          `${acc}${index > 0 ? '\n' : ''}${getRestrictionByValue(restriction)}`,
        '',
      )
    : ''

  const paragraphBreak =
    hasRequestedCustodyRestrictions && hasRequestedOtherRestrictions ? '\n' : ''

  const requestedOtherRestrictionsText = hasRequestedOtherRestrictions
    ? requestedOtherRestrictions
    : ''

  return `${requestedCustodyRestrictionsText}${paragraphBreak}${requestedOtherRestrictionsText}`
}

export function formatGender(gender?: Gender): string {
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

export function formatAppeal(
  appealDecision: CaseAppealDecision | undefined,
  stakeholder: string,
): string {
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

export function formatRequestCaseType(type: CaseType): string {
  return isRestrictionCase(type) ||
    type === CaseType.RESTRAINING_ORDER ||
    type === CaseType.PSYCHIATRIC_EXAMINATION
    ? caseTypes[type]
    : 'rannsóknarheimild'
}
