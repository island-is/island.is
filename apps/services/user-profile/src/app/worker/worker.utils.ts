import { UserProfile } from '../user-profile/userProfile.model'
import { UserProfileAdvania } from './userProfileAdvania.model'

const stringHasValue = (value?: string) =>
  typeof value === 'string' && value.length > 0

export const hasMatchingContactInfo = (
  migratedProfile: UserProfileAdvania,
  existingProfile?: UserProfile,
) => {
  const matchingPhoneNumbers =
    stringHasValue(existingProfile.mobilePhoneNumber) &&
    existingProfile.mobilePhoneNumber === migratedProfile.mobilePhoneNumber
  const matchingEmails =
    stringHasValue(existingProfile.email) &&
    existingProfile.email === migratedProfile.email

  return matchingPhoneNumbers && matchingEmails
}
