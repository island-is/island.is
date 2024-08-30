import { getValueViaPath } from '@island.is/application/core'
import { FormValue, NO, YES } from '@island.is/application/types'

export const hasOperator = (answers: FormValue) => {
  const hasOperator = getValueViaPath(
    answers,
    'operatorInformation.hasOperator',
    NO,
  ) as typeof NO | typeof YES

  return hasOperator === YES
}
