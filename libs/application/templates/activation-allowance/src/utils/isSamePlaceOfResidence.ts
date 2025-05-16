import { getValueViaPath } from '@island.is/application/core'
import { FormValue } from '@island.is/application/types'

export const isSamePlaceOfResidence = (answers: FormValue): boolean => {
  const isSamePlaceOfResidence =
    getValueViaPath<string[]>(answers, 'applicant.isSamePlaceOfResidence') ?? []
  return isSamePlaceOfResidence.length > 0
}
