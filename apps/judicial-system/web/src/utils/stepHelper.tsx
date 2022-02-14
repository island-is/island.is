import { TagVariant } from '@island.is/island-ui/core'
import { formatDate } from '@island.is/judicial-system/formatters'
import {
  CaseCustodyRestrictions,
  Gender,
} from '@island.is/judicial-system/types'
import parseISO from 'date-fns/parseISO'
import addDays from 'date-fns/addDays'

/**
 * A value is considered dirty if it's a string, either an empty string or not.
 * On the contrary a value is pristine if it's undefined or null.
 * @param value check if this value is dirty
 */
export const isDirty = (value?: string | null): boolean => {
  return typeof value === 'string'
}

export const getShortGender = (gender?: Gender): string => {
  switch (gender) {
    case Gender.MALE: {
      return 'kk'
    }
    case Gender.FEMALE: {
      return 'kvk'
    }
    case Gender.OTHER: {
      return 'annað'
    }
    default: {
      return ''
    }
  }
}

export const getRestrictionTagVariant = (
  restriction: CaseCustodyRestrictions,
): TagVariant => {
  switch (restriction) {
    case CaseCustodyRestrictions.COMMUNICATION:
    case CaseCustodyRestrictions.ALTERNATIVE_TRAVEL_BAN_CONFISCATE_PASSPORT: {
      return 'rose'
    }
    case CaseCustodyRestrictions.ISOLATION: {
      return 'red'
    }
    case CaseCustodyRestrictions.MEDIA:
    case CaseCustodyRestrictions.ALTERNATIVE_TRAVEL_BAN_REQUIRE_NOTIFICATION: {
      return 'blueberry'
    }
    case CaseCustodyRestrictions.VISITAION: {
      return 'purple'
    }
    default: {
      return 'darkerBlue'
    }
  }
}

export const kb = (bytes?: number) => {
  return bytes ? Math.ceil(bytes / 1024) : ''
}

export const getAppealEndDate = (rulingDate: string) => {
  const rulingDateToDate = parseISO(rulingDate)
  const appealEndDate = addDays(rulingDateToDate, 3)
  return formatDate(appealEndDate, 'PPPp')
}

export const getTextareaRows = (
  minRows: number,
  maxRows: number,
  text?: string,
) => {
  if (!text) {
    return minRows
  }

  const nrOfCharsPerLine = 72
  const maxText = maxRows * nrOfCharsPerLine
  const minText = minRows * nrOfCharsPerLine

  const textLength = text.replace(/\s/g, '').length
  const variableRows = Math.ceil(text.split(' ').length / 12)

  return textLength > maxText
    ? maxRows
    : textLength > minText
    ? variableRows <= minRows
      ? minRows
      : variableRows >= maxRows
      ? maxRows
      : variableRows
    : minRows
}
