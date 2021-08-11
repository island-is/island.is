import { FormValue } from '@island.is/application/core'
import { WhoIsTheNotificationForEnum } from '../types'

export const isPowerOfAttorney = (formValue: FormValue) => {
  const reportingOnBehalfType = (formValue as {
    whoIsTheNotificationFor: { answer: WhoIsTheNotificationForEnum }
  })?.whoIsTheNotificationFor?.answer
  return reportingOnBehalfType === WhoIsTheNotificationForEnum.POWEROFATTORNEY
}
