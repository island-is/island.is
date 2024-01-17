import { UserProfile } from '../user-profile/userProfile.model'
import { UserProfileAdvania } from './userProfileAdvania.model'

const stringHasValue = (value?: string) =>
  typeof value === 'string' && value.length > 0

export const hasMatchingEmail = (left: string, right: string) =>
  stringHasValue(left) && left?.toLowerCase?.() === right?.toLocaleLowerCase()

export const hasMatchingContactInfo = (
  migratedProfile: UserProfileAdvania,
  existingProfile?: UserProfile,
) => {
  const migratedPhoneNumber = migratedProfile.mobilePhoneNumber
  const existingPhoneNumber = existingProfile.mobilePhoneNumber

  const migratedEmail = migratedProfile.email
  const existingEmail = existingProfile.email

  const matchingPhoneNumbers =
    stringHasValue(existingPhoneNumber) &&
    existingPhoneNumber === migratedPhoneNumber

  const matchingEmails = hasMatchingEmail(existingEmail, migratedEmail)

  return matchingPhoneNumbers && matchingEmails
}
