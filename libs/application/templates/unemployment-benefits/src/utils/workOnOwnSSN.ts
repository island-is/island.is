import { getValueViaPath, YES } from '@island.is/application/core'
import { FormValue } from '@island.is/application/types'

export const workOnOwnSSN = (answers: FormValue) => {
  const workOnOwnSSN = getValueViaPath<string>(
    answers,
    'employmentHistory.workOnOwnSSN',
    '',
  )
  return workOnOwnSSN === YES
}
