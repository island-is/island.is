import { FormValue } from '@island.is/application/core'
import { WhoIsTheNotificationForEnum } from '../types'

export const isReportingOnBehalfOfEmployee = (formValue: FormValue) => {
  const whoIsTheNotificationFor = (formValue as {
    whoIsTheNotificationFor: { answer: WhoIsTheNotificationForEnum }
  })?.whoIsTheNotificationFor?.answer
  return whoIsTheNotificationFor === WhoIsTheNotificationForEnum.JURIDICALPERSON
}
