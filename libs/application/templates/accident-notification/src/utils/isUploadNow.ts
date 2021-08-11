import { FormValue } from '@island.is/application/core'
import {
  PowerOfAttorneyUploadEnum,
  WhoIsTheNotificationForEnum,
} from '../types'

export const isUploadNow = (formValue: FormValue) => {
  const reportingOnBehalfType = (formValue as {
    whoIsTheNotificationFor: { answer: WhoIsTheNotificationForEnum }
  })?.whoIsTheNotificationFor?.answer

  const powerOfAttorneyType = (formValue as {
    powerOfAttorney: { type: PowerOfAttorneyUploadEnum }
  })?.powerOfAttorney?.type

  return (
    reportingOnBehalfType === WhoIsTheNotificationForEnum.POWEROFATTORNEY &&
    powerOfAttorneyType === PowerOfAttorneyUploadEnum.UPLOADNOW
  )
}
