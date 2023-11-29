import { FormValue } from '@island.is/application/types'
import { getValueViaPath } from '@island.is/application/core'
import { OperatorInformation, UserInformation } from '../shared'

export const hasReviewerApproved = (
  reviewerNationalId: string,
  answers: FormValue,
) => {
  // Check if reviewer is owner coowner and has not approved
  const ownerCoOwners = getValueViaPath(
    answers,
    'ownerCoOwner',
    [],
  ) as UserInformation[]
  const ownerCoOwner = ownerCoOwners.find(
    (ownerCoOwner) => ownerCoOwner.nationalId === reviewerNationalId,
  )
  if (ownerCoOwner) {
    const hasApproved = ownerCoOwner?.approved || false
    if (!hasApproved) return false
  }

  // Check if reviewer is operator and has not approved
  const operators = getValueViaPath(
    answers,
    'operators',
    [],
  ) as OperatorInformation[]
  const operator = operators
    .filter(({ wasRemoved }) => wasRemoved !== 'true')
    .find((operator) => operator.nationalId === reviewerNationalId)
  if (operator) {
    const hasApproved = operator?.approved || false
    if (!hasApproved) return false
  }

  return true
}
