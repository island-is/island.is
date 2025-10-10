import { getValueViaPath, YES } from '@island.is/application/core'
import { FormValue } from '@island.is/application/types'

export const isOtherAddressChecked = (answers: FormValue): boolean => {
  const isOtherAddressChecked =
    getValueViaPath<string[]>(answers, 'applicant.otherAddressCheckbox') ?? []

  return isOtherAddressChecked ? isOtherAddressChecked[0] === YES : false
}
