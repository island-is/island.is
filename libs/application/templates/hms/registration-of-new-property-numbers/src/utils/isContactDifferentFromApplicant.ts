import { getValueViaPath, YES } from '@island.is/application/core'
import { FormValue } from '@island.is/application/types'

export const isContactDifferentFromApplicant = (formValue: FormValue) => {
  const sameAsApplicantCheckValue = getValueViaPath<Array<string>>(
    formValue,
    'contact.isSameAsApplicant',
  )

  if (!sameAsApplicantCheckValue || !sameAsApplicantCheckValue.includes(YES)) {
    return true
  }
  return false
}
