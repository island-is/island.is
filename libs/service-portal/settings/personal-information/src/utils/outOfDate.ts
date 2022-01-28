import { UserProfile } from '@island.is/api/schema'
import differenceInMonths from 'date-fns/differenceInMonths'

export const outOfDate = (getUserProfile: UserProfile) => {
  const emptyMail = getUserProfile?.emailStatus === 'EMPTY'
  const emptyMobile = getUserProfile?.mobileStatus === 'EMPTY'
  const modifiedProfileDate = getUserProfile?.modified
  const dateNow = new Date(Date.now())
  const dateModified = new Date(modifiedProfileDate)
  const diffInMonths = differenceInMonths(dateNow, dateModified)
  const diffOutOfDate = diffInMonths > 2
  const outOfDateEmailMobile =
    (emptyMail && diffOutOfDate) || (emptyMobile && diffOutOfDate)
  return outOfDateEmailMobile
}
