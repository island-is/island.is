import { FormValue, getValueViaPath } from '@island.is/application/core'
import { WhoIsTheNotificationForEnum } from '../types'

export const isPowerOfAttorney = (formValue: FormValue) => {
  const reportingOnBehalfType = getValueViaPath(
    formValue,
    'whoIsTheNotificationFor.answer',
  ) as WhoIsTheNotificationForEnum
  return reportingOnBehalfType === WhoIsTheNotificationForEnum.POWEROFATTORNEY
}
