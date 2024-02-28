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

export const chooseEmailFields = (
  migratedProfile: UserProfileAdvania,
  existingProfile: UserProfile,
): Pick<UserProfile, 'email' | 'emailVerified' | 'emailStatus'> => {
  if (stringHasValue(migratedProfile.email)) {
    return {
      email: migratedProfile.email,
      emailVerified: false,
      emailStatus: 'NOT_VERIFIED',
    }
  }

  return {
    email: existingProfile.email,
    emailVerified: existingProfile.emailVerified,
    emailStatus: existingProfile.emailStatus,
  }
}

export const choosePhoneNumberFields = (
  migratedProfile: UserProfileAdvania,
  existingProfile: UserProfile,
): Pick<
  UserProfile,
  'mobilePhoneNumber' | 'mobilePhoneNumberVerified' | 'mobileStatus'
> => {
  if (stringHasValue(migratedProfile.mobilePhoneNumber)) {
    return {
      mobilePhoneNumber: migratedProfile.mobilePhoneNumber,
      mobilePhoneNumberVerified: false,
      mobileStatus: 'NOT_VERIFIED',
    }
  }

  return {
    mobilePhoneNumber: existingProfile.mobilePhoneNumber,
    mobilePhoneNumberVerified: existingProfile.mobilePhoneNumberVerified,
    mobileStatus: existingProfile.mobileStatus,
  }
}

export const chooseEmailAndPhoneNumberFields = (
  migratedProfile: UserProfileAdvania,
  existingProfile: UserProfile,
): ReturnType<typeof chooseEmailFields> &
  ReturnType<typeof choosePhoneNumberFields> => ({
  ...chooseEmailFields(migratedProfile, existingProfile),
  ...choosePhoneNumberFields(migratedProfile, existingProfile),
})
