import { getValueViaPath, YES } from '@island.is/application/core'
import { FormValue } from '@island.is/application/types'

export const isIndependent = (answers: FormValue) => {
  const isIndependent = getValueViaPath<string>(
    answers,
    'employmentHistory.independentOwnSsn',
  )
  return isIndependent === YES
}
