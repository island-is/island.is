import { getValueViaPath } from '@island.is/application/core'
import { FormValue } from '@island.is/application/types'
import { WhoIsTheNotificationForEnum } from './enums'

export const isReportingOnBehalfOfInjured = (formValue: FormValue) => {
  const whoIsTheNotificationFor = getValueViaPath<WhoIsTheNotificationForEnum>(
    formValue,
    'whoIsTheNotificationFor.answer',
  )
  return (
    whoIsTheNotificationFor === WhoIsTheNotificationForEnum.JURIDICALPERSON ||
    whoIsTheNotificationFor === WhoIsTheNotificationForEnum.POWEROFATTORNEY
  )
}

export const isReportingOnBehalfOfEmployee = (formValue: FormValue) => {
  const whoIsTheNotificationFor = getValueViaPath<WhoIsTheNotificationForEnum>(
    formValue,
    'whoIsTheNotificationFor.answer',
  )
  return whoIsTheNotificationFor === WhoIsTheNotificationForEnum.JURIDICALPERSON
}

export const isReportingOnBehalfOfChild = (formValue: FormValue) => {
  const whoIsTheNotificationFor = getValueViaPath<WhoIsTheNotificationForEnum>(
    formValue,
    'whoIsTheNotificationFor.answer',
  )
  return whoIsTheNotificationFor === WhoIsTheNotificationForEnum.CHILDINCUSTODY
}

export const isReportingOnBehalfSelf = (formValue: FormValue) => {
  const whoIsTheNotificationFor = getValueViaPath<WhoIsTheNotificationForEnum>(
    formValue,
    'whoIsTheNotificationFor.answer',
  )
  return whoIsTheNotificationFor === WhoIsTheNotificationForEnum.ME
}
