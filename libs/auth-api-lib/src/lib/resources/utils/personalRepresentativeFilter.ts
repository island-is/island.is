import { AuthDelegationType } from '@island.is/shared/types'

/**
 * Filter out Personal Representative delegation type from the supported delegation types
 * @param supportedDelegationType
 */
export const filterPersonalRepresentative = (
  supportedDelegationType: string[],
) => {
  return supportedDelegationType.filter(
    (delegationType) =>
      !delegationType.startsWith(AuthDelegationType.PersonalRepresentative),
  )
}
