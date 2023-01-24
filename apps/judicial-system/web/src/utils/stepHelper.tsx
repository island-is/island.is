import parseISO from 'date-fns/parseISO'
import addDays from 'date-fns/addDays'

import { TagVariant } from '@island.is/island-ui/core'
import { formatDate } from '@island.is/judicial-system/formatters'
import {
  Case,
  CaseCustodyRestrictions,
  Gender,
} from '@island.is/judicial-system/types'
import { UserRole } from '@island.is/judicial-system-web/src/graphql/schema'

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
    case CaseCustodyRestrictions.COMMUNICATION: {
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

export const isBusiness = (nationalId?: string) => {
  if (!nationalId) {
    return false
  }

  return parseInt(nationalId.slice(0, 2)) > 31
}

export const createCaseResentExplanation = (
  workingCase: Case,
  explanation?: string,
) => {
  const now = new Date()

  return `${
    workingCase.caseResentExplanation
      ? `${workingCase.caseResentExplanation}<br/><br/>`
      : ''
  }Krafa endursend ${formatDate(now, 'PPPp')} - ${explanation}`
}

const prosecutionRoles = [UserRole.Prosecutor, UserRole.Representative]

export function isProsecutionRole(role: UserRole): boolean {
  return prosecutionRoles.includes(role)
}

export const extendedCourtRoles = [
  UserRole.Judge,
  UserRole.Registrar,
  UserRole.Assistant,
]

export function isExtendedCourtRole(role: UserRole): boolean {
  return extendedCourtRoles.includes(role)
}

export const courtRoles = [UserRole.Judge, UserRole.Registrar]

export function isCourtRole(role: UserRole): boolean {
  return courtRoles.includes(role)
}
