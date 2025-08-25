import { getValueViaPath, YES } from '@island.is/application/core'
import { FormValue } from '@island.is/application/types'

export const hasLeaveDays = (index: number, answers: FormValue) => {
  const leaveDaysRadioAnswer = getValueViaPath<Array<string>>(
    answers,
    `income[${index}].hasLeaveDays`,
  )

  if (leaveDaysRadioAnswer && leaveDaysRadioAnswer.includes(YES)) {
    return true
  }
  return false
}
