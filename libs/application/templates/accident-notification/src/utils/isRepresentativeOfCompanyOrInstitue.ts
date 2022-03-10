import { FormValue, getValueViaPath } from '@island.is/application/core'
import { YES } from '../constants'
import { WhoIsTheNotificationForEnum } from '../types'

export const isRepresentativeOfCompanyOrInstitute = (formValue: FormValue) => {
  return (
    getValueViaPath(formValue, 'whoIsTheNotificationFor.answer') ===
    WhoIsTheNotificationForEnum.JURIDICALPERSON
  )
}

export const isInjuredAndRepresentativeOfCompanyOrInstitute = (
  formValue: FormValue,
) => {
  return formValue.isRepresentativeOfCompanyOrInstitue?.toString() === YES
}
