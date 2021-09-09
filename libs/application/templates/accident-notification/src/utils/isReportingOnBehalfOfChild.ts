import { FormValue } from '@island.is/application/core'
import { WhoIsTheNotificationForEnum } from '../types'

export const isReportingOnBehalfOfChild = (formValue: FormValue) => {
  const whoIsTheNotificationFor = (formValue as {
    whoIsTheNotificationFor: { answer: WhoIsTheNotificationForEnum }
  })?.whoIsTheNotificationFor?.answer
  return whoIsTheNotificationFor === WhoIsTheNotificationForEnum.CHILDINCUSTODY
}
