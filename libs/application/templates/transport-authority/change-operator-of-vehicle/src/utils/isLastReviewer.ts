import { getValueViaPath } from '@island.is/application/core'
import { FormValue } from '@island.is/application/types'
import { OperatorInformation, UserInformation } from '../shared'

export const isLastReviewer = (
  reviewerNationalId: string,
  answers: FormValue,
) => {
  // First check if any reviewer that is not the current user has not approved
  const ownerCoOwners = getValueViaPath(
    answers,
    'ownerCoOwner',
    [],
  ) as UserInformation[]
  const approvedOwnerCoOwner = ownerCoOwners.find((ownerCoOwner) => {
    return (
      ownerCoOwner.nationalId !== reviewerNationalId && !ownerCoOwner.approved
    )
  })
  if (approvedOwnerCoOwner) {
    return false
  }

  const operators = getValueViaPath(
    answers,
    'operators',
    [],
  ) as OperatorInformation[]
  const approvedOperator = operators
    .filter(({ wasRemoved }) => wasRemoved !== 'true')
    .find(
      (operator) =>
        operator.nationalId !== reviewerNationalId && !operator.approved,
    )
  if (approvedOperator) {
    return false
  }

  return true
}
