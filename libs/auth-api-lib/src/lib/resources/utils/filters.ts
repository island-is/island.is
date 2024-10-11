import { AuthDelegationType } from '@island.is/shared/types'

// Defined delegation types that are only manageable by superusers
export const SUPER_USER_DELEGATION_TYPES = [
  AuthDelegationType.PersonalRepresentative,
  AuthDelegationType.LegalRepresentative,
]

/**
 * Filter and remove delegation types that are only authorized for superusers
 * @param supportedDelegationType
 */
export const delegationTypeSuperUserFilter = (
  supportedDelegationType: AuthDelegationType[],
) => {
  return supportedDelegationType.filter(
    (delegationType) => !SUPER_USER_DELEGATION_TYPES.includes(delegationType),
  )
}
