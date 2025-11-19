import { getValueViaPath } from '@island.is/application/core'
import { FormValue } from '@island.is/application/types'
import { IncomeCheckboxValues } from './enums'

export const incomeFromOtherThanJobChecked = (
  index: number,
  answers: FormValue,
) => {
  const incomeFromOtherThanJobCheckedAnswer = getValueViaPath<Array<string>>(
    answers,
    `income[${index}].checkbox`,
  )

  if (
    incomeFromOtherThanJobCheckedAnswer &&
    incomeFromOtherThanJobCheckedAnswer.includes(
      IncomeCheckboxValues.INCOME_FROM_OTHER_THAN_JOB,
    )
  ) {
    return true
  }
  return false
}
