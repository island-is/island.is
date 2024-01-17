import { UserProfile } from '../user-profile/userProfile.model'
import { UserProfileAdvania } from './userProfileAdvania.model'

const stringHasValue = (value?: string) =>
  typeof value === 'string' && value.length > 0

export const stringsHaveMatchingValue = (
  a?: string,
  b?: string,
  forceLowerCase = false,
) => {
  const valueOfA = forceLowerCase ? a?.toLowerCase?.() : a
  const valueOfB = forceLowerCase ? b?.toLowerCase?.() : b

  return stringHasValue(a) && valueOfA === valueOfB
}

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

  const matchingEmails = stringsHaveMatchingValue(
    existingEmail,
    migratedEmail,
    true,
  )

  return matchingPhoneNumbers && matchingEmails
}
