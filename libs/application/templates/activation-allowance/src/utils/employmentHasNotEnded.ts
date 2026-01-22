import { getValueViaPath, NO } from '@island.is/application/core'
import { FormValue } from '@island.is/application/types'

export const employmentHasNotEnded = (index: number, answers: FormValue) => {
  const employmentEndedAnswer = getValueViaPath<string>(
    answers,
    `income[${index}].hasEmploymentEnded`,
  )

  return employmentEndedAnswer === NO
}
