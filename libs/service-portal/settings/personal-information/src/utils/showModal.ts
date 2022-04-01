import { UserProfile } from '@island.is/api/schema'
import differenceInMonths from 'date-fns/differenceInMonths'

/**
 * MODIFIED_FALLBACK_TIME
 * This represents the date of the deployment of this feature.
 * It's used for displaying the modal at least 6 months from deployment.
 * For some use-cases we can have a user come in with email+tel, but no modification date.
 * When the user interacts with the modal, a modification date is set.
 */
const MODIFIED_FALLBACK_TIME = new Date('2022-04-01T00:00:00Z')

export const showModal = (getUserProfile: UserProfile | undefined | null) => {
  if (!getUserProfile) {
    return false
  }

  const userProfileEmail = getUserProfile.email
  const userProfileTel = getUserProfile.mobilePhoneNumber
  const hasEmailAndTel = userProfileEmail && userProfileTel

  const modifiedProfileDate = getUserProfile.modified ?? MODIFIED_FALLBACK_TIME
  const dateNow = new Date()
  const dateModified = new Date(modifiedProfileDate)
  const diffInMonths = differenceInMonths(dateNow, dateModified)
  const diffModifiedOverMaxDate = diffInMonths >= 6

  return (
    (!hasEmailAndTel && !getUserProfile.modified) || diffModifiedOverMaxDate
  )
}
