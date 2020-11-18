import { format, parseISO, isValid } from 'date-fns' // eslint-disable-line no-restricted-imports
// Importing 'is' directly from date-fns/locale/is has caused unexpected problems
import { is } from 'date-fns/locale' // eslint-disable-line no-restricted-imports

import {
  CaseCustodyRestrictions,
  CaseGender,
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
): string | undefined {
  const theDate: Date = getAsDate(date)

  if (isValid(theDate)) {
    return format(theDate, formatPattern, { locale: is })
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
  }
}

export const formatCustodyRestrictions = (
  restrictions?: CaseCustodyRestrictions[],
) => {
  return restrictions && restrictions.length > 0
    ? restrictions
        .map((restriction) => getRestrictionByValue(restriction))
        .toString()
        .replace(',', ', ')
    : 'Ekki er farið fram á takmarkanir á gæslu'
}

export function formatGender(gender: CaseGender): string {
  switch (gender) {
    case CaseGender.MALE:
      return 'karl'
    case CaseGender.FEMALE:
      return 'kona'
    case CaseGender.OTHER:
      return 'annað'
  }
}
