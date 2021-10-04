import { FormValue, getValueViaPath } from '@island.is/application/core'
import { WhoIsTheNotificationForEnum } from '../types'

export const isRepresentativeOfCompanyOrInstitute = (formValue: FormValue) => {
  return (
    getValueViaPath(formValue, 'whoIsTheNotificationFor.answer') ===
    WhoIsTheNotificationForEnum.JURIDICALPERSON
  )
}
