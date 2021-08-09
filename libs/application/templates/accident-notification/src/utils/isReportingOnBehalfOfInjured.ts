import { FormValue } from '@island.is/application/core'
import { WhoIsTheNotificationForEnum } from '../types'

export const isReportingOnBehalfOfInjured = (formValue: FormValue) => {
  const reportingOnBehalfType = (formValue as {
    whoIsTheNotificationFor: { answer: WhoIsTheNotificationForEnum }
  })?.whoIsTheNotificationFor?.answer
  return (
    reportingOnBehalfType === WhoIsTheNotificationForEnum.JURIDICALPERSON ||
    reportingOnBehalfType === WhoIsTheNotificationForEnum.POWEROFATTORNEY
  )
}
