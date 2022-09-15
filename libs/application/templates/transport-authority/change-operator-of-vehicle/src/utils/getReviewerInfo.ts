import { getValueViaPath } from '@island.is/application/core'
import { FormValue } from '@island.is/application/types'
import { UserInformation, OperatorInformation } from '../shared'

export const getReviewerInfo = (
  reviewerNationalId: string,
  answers: FormValue,
) => {
  // If reviewer is owner coowner
  const ownerCoOwners = getValueViaPath(
    answers,
    'ownerCoOwner',
    [],
  ) as UserInformation[]
  const ownerCoOwner = ownerCoOwners.find(
    (ownerCoOwner) => ownerCoOwner.nationalId === reviewerNationalId,
  )
  if (ownerCoOwner) {
    return ownerCoOwner
  }

  // If reviewer is operator
  const operators = getValueViaPath(
    answers,
    'operators',
    [],
  ) as OperatorInformation[]
  const operator = operators
    .filter(({ wasRemoved }) => wasRemoved !== 'true')
    .find((operator) => operator.nationalId === reviewerNationalId)
  if (operator) {
    return operator
  }

  return null
}
