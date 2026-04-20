import type { BffUser } from '@island.is/shared/types'

interface BackendUser {
  subjectType?: string
}

/**
 * Checks if the user is a company (legal entity)
 * @param userOrProfile - Either a BffUser object, backend User object, or a profile object with subjectType
 * @returns true if the user is a company (legal entity)
 */
export const isCompany = (
  userOrProfile?: BffUser | BffUser['profile'] | BackendUser | null,
): boolean => {
  if (!userOrProfile) {
    return false
  }

  // Check if it's a BffUser object (has profile property)
  if ('profile' in userOrProfile) {
    return userOrProfile.profile?.subjectType === 'legalEntity'
  }

  // Check if it has subjectType directly (backend User or profile object)
  if ('subjectType' in userOrProfile) {
    return userOrProfile.subjectType === 'legalEntity'
  }

  return false
}
