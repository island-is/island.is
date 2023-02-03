import { getValueViaPath } from '@island.is/application/core'
import { FormValue } from '@island.is/application/types'
import { UserInformation, OwnerCoOwnersInformation } from '../shared'

export const getReviewerInfo = (
  reviewerNationalId: string,
  answers: FormValue,
) => {
  // If reviewer is owner coowner
  const ownerCoOwners = getValueViaPath(
    answers,
    'ownerCoOwners',
    [],
  ) as OwnerCoOwnersInformation[]

  const ownerCoOwner = ownerCoOwners.find(
    (ownerCoOwner) => ownerCoOwner.nationalId === reviewerNationalId,
  )
  if (ownerCoOwner) {
    return ownerCoOwner
  }

  // If reviewer is operator
  const coOwners = getValueViaPath(answers, 'coOwners', []) as UserInformation[]

  const coOwner = coOwners.find(
    (operator) => operator.nationalId === reviewerNationalId,
  )
  if (coOwner) {
    return coOwner
  }

  return null
}
