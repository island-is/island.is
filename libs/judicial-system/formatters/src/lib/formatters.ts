import { format, parseISO, isValid } from 'date-fns' // eslint-disable-line no-restricted-imports
// Importing 'is' directly from date-fns/locale/is has caused unexpected problems
import { is } from 'date-fns/locale' // eslint-disable-line no-restricted-imports

import {
  CaseAppealDecision,
  CaseCustodyRestrictions,
  CaseGender,
  CaseType,
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
  if (nationalId?.length === 10) {
    return `${nationalId.slice(0, 6)}-${nationalId.slice(6)}`
  } else {
    return nationalId
  }
}

export const laws = {
  _95_1_A: 'a-lið 1. mgr. 95. gr.',
  _95_1_B: 'b-lið 1. mgr. 95. gr.',
  _95_1_C: 'c-lið 1. mgr. 95. gr.',
  _95_1_D: 'd-lið 1. mgr. 95. gr.',
  _95_2: '2. mgr. 95. gr.',
  _99_1_B: 'b-lið 1. mgr. 99. gr.',
  _100_1: '1. mgr. 100. gr. sml.',
}

export const caseTypes = {
  CUSTODY: 'gæsluvarðhald',
  TRAVEL_BAN: 'farbann',
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
    case CaseCustodyRestrictions.ALTERNATIVE_TRAVEL_BAN_CONFISCATE_PASSPORT:
      return 'Afhending vegabréfs'
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
    case CaseCustodyRestrictions.ALTERNATIVE_TRAVEL_BAN_CONFISCATE_PASSPORT:
      return 'Afhending vegabréfs'
    case CaseCustodyRestrictions.NECESSITIES:
      return 'Eigin nauðsynjar'
    case CaseCustodyRestrictions.WORKBAN:
      return 'Vinnubann'
  }
}

export enum NounCases {
  NOMINATIVE, // Nefnifall
  ACCUSATIVE, // Þolfall
  DATIVE, // Þágufall
  GENITIVE, // Eignarfall
}

export function formatAccusedByGender(
  accusedGender?: CaseGender,
  nounCase: NounCases = NounCases.NOMINATIVE,
  isInvestigationCase?: boolean,
) {
  if (isInvestigationCase) {
    return nounCase === NounCases.NOMINATIVE ? 'varnaraðili' : 'varnaraðila'
  } else {
    switch (accusedGender) {
      case CaseGender.MALE:
        return nounCase === NounCases.NOMINATIVE ? 'kærði' : 'kærða'
      case CaseGender.FEMALE:
        return nounCase === NounCases.NOMINATIVE ? 'kærða' : 'kærðu'
      case CaseGender.OTHER:
      default:
        return 'kærða'
    }
  }
}

// Formats the restrictions set by the judge
// Note that only the predetermined list of restrictions is relevant here
export function formatCustodyRestrictions(
  accusedGender?: CaseGender,
  custodyRestrictions?: CaseCustodyRestrictions[],
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
    ?.filter((restriction) => custodyRestrictions?.includes(restriction.type))
    .sort((a, b) => {
      return a.id > b.id ? 1 : -1
    })

  if (
    !(relevantCustodyRestrictions && relevantCustodyRestrictions.length > 0)
  ) {
    return ''
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

// Fromats the restrictions set by the judge when choosing alternative travle ban
export const formatAlternativeTravelBanRestrictions = (
  accusedGender?: CaseGender,
  custodyRestrictions?: CaseCustodyRestrictions[],
  otherRestrictions?: string,
): string => {
  const relevantCustodyRestrictions = custodyRestrictions?.filter(
    (restriction) =>
      [
        CaseCustodyRestrictions.ALTERNATIVE_TRAVEL_BAN_REQUIRE_NOTIFICATION,
        CaseCustodyRestrictions.ALTERNATIVE_TRAVEL_BAN_CONFISCATE_PASSPORT,
      ].includes(restriction),
  )

  const hasTravelBanRestrictions =
    relevantCustodyRestrictions && relevantCustodyRestrictions?.length > 0
  const hasOtherRestrictions = otherRestrictions && otherRestrictions.length > 0

  // No restrictions
  if (!hasTravelBanRestrictions && !hasOtherRestrictions) {
    return ''
  }

  const accusedGenderText = formatAccusedByGender(
    accusedGender,
    NounCases.DATIVE,
  )

  const travelBanRestrictionsText = hasTravelBanRestrictions
    ? `Sækjandi tekur fram að farbannið verði með takmörkunum.${
        relevantCustodyRestrictions?.includes(
          CaseCustodyRestrictions.ALTERNATIVE_TRAVEL_BAN_REQUIRE_NOTIFICATION,
        )
          ? ` Að ${accusedGenderText} verði gert að tilkynna sig.`
          : ''
      }${
        relevantCustodyRestrictions?.includes(
          CaseCustodyRestrictions.ALTERNATIVE_TRAVEL_BAN_CONFISCATE_PASSPORT,
        )
          ? ` Að ${accusedGenderText} verði gert að afhenda vegabréfið sitt.`
          : ''
      }`
    : ''

  const paragraphBreak =
    hasTravelBanRestrictions && hasOtherRestrictions ? '\n' : ''

  const otherRestrictionsText = hasOtherRestrictions ? otherRestrictions : ''

  return `${travelBanRestrictionsText}${paragraphBreak}${otherRestrictionsText}`
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

export function formatGender(gender?: CaseGender): string {
  switch (gender) {
    case CaseGender.MALE:
      return 'Karl'
    case CaseGender.FEMALE:
      return 'Kona'
    case CaseGender.OTHER:
    default:
      return 'Kynsegin/Annað'
  }
}

export function formatGenderPronouns(gender?: CaseGender): string {
  switch (gender) {
    case CaseGender.MALE:
      return 'hann'
    case CaseGender.FEMALE:
      return 'hún'
    case CaseGender.OTHER:
    default:
      return 'hán'
  }
}

export function formatAppeal(
  appealDecision: CaseAppealDecision | undefined,
  stakeholder: string,
  stakeholderGender: CaseGender = CaseGender.MALE,
): string {
  const stakeholderGenderText = formatGenderPronouns(stakeholderGender)

  switch (appealDecision) {
    case CaseAppealDecision.APPEAL:
      return `${stakeholder} lýsir því yfir að ${stakeholderGenderText} kæri úrskurðinn til Landsréttar.`
    case CaseAppealDecision.ACCEPT:
      return `${stakeholder} unir úrskurðinum.`
    case CaseAppealDecision.POSTPONE:
      return `${stakeholder} lýsir því yfir að ${stakeholderGenderText} taki sér lögbundinn kærufrest.`
    default:
      return ''
  }
}
