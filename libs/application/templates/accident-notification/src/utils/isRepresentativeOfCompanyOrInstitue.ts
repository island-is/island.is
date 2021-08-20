import { FormValue } from '@island.is/application/core'
import { YES } from '../constants'

export const isRepresentativeOfCompanyOrInstitute = (formValue: FormValue) => {
  return formValue.isRepresentativeOfCompanyOrInstitue?.toString() === YES
}
