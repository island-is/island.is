import { getValueViaPath, YES } from '@island.is/application/core'
import { FormValue } from '@island.is/application/types'

export const isSamePlaceOfResidenceChecked = (answers: FormValue): boolean => {
  const isSamePlaceOfResidenceChecked =
    getValueViaPath<string[]>(answers, 'applicant.isSamePlaceOfResidence') ?? []

  return isSamePlaceOfResidenceChecked
    ? isSamePlaceOfResidenceChecked[0] === YES
    : false
}
