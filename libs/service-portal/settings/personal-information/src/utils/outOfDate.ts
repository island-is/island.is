import differenceInMonths from 'date-fns/differenceInMonths'

import { UserProfile } from '@island.is/api/schema'

export const outOfDate = (getUserProfile: UserProfile) => {
  const emptyMail = getUserProfile?.emailStatus === 'EMPTY'
  const emptyMobile = getUserProfile?.mobileStatus === 'EMPTY'
  const modifiedProfileDate = getUserProfile?.modified
  const dateNow = new Date()
  const dateModified = new Date(modifiedProfileDate)
  const diffInMonths = differenceInMonths(dateNow, dateModified)
  const diffOutOfDate = diffInMonths >= 3
  const outOfDateEmailMobile = (emptyMail || emptyMobile) && diffOutOfDate
  return outOfDateEmailMobile
}
