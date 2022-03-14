import { UserProfile } from '@island.is/api/schema'
import differenceInMonths from 'date-fns/differenceInMonths'

export const showModal = (getUserProfile: UserProfile | undefined | null) => {
  if (!getUserProfile) {
    return false
  }

  const userProfileEmail = getUserProfile.email
  const userProfileTel = getUserProfile.mobilePhoneNumber
  const hasEmailAndTel = userProfileEmail && userProfileTel

  const modifiedProfileDate = getUserProfile?.modified
  const dateNow = new Date()
  const dateModified = new Date(modifiedProfileDate)
  const diffInMonths = differenceInMonths(dateNow, dateModified)
  const diffModifiedOverMaxDate = diffInMonths >= 6

  return !hasEmailAndTel || diffModifiedOverMaxDate
}
