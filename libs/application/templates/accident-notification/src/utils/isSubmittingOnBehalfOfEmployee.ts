import { FormValue } from '@island.is/application/core'
import { WhoIsTheNotificationForEnum } from '../types'

export const isSubmittingOnBehalfOfEmployee = (formValue: FormValue) => {
  const whoIsTheNotificationFor = (formValue as {
    whoIsTheNotificationFor: { answer: WhoIsTheNotificationForEnum }
  })?.whoIsTheNotificationFor?.answer
  return whoIsTheNotificationFor === WhoIsTheNotificationForEnum.JURIDICALPERSON
}
