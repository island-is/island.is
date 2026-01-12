import { getValueViaPath } from '@island.is/application/core'
import { FormValue } from '@island.is/application/types'
import { RegisterNumber } from '../shared/types'

export const isApplyingForMultiple = (answers: FormValue): boolean => {
  const isApplyingForMultiple = getValueViaPath<RegisterNumber>(
    answers,
    'applicant.registerManyQuestion',
    RegisterNumber.many,
  )
  return isApplyingForMultiple === RegisterNumber.many
}
