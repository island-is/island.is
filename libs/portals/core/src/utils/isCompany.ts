import type { BffUser } from '@island.is/shared/types'

/**
 * Checks if the user is a company (legal entity)
 * @param userOrProfile - Either a BffUser object or a profile object with subjectType
 * @returns true if the user is a company (legal entity)
 */
export const isCompany = (
  userOrProfile?: BffUser | BffUser['profile'] | null,
): boolean => {
  if (!userOrProfile) {
    return false
  }

  // Check if it's a BffUser object (has profile property)
  if ('profile' in userOrProfile) {
    return userOrProfile.profile?.subjectType === 'legalEntity'
  }

  // Otherwise it's a profile object
  return userOrProfile.subjectType === 'legalEntity'
}
