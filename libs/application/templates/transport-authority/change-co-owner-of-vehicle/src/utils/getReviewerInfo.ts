import { getValueViaPath } from '@island.is/application/core'
import { FormValue } from '@island.is/application/types'
import { CoOwnersInformation, OwnerCoOwnersInformation } from '../shared'

export const getReviewerInfo = (
  reviewerNationalId: string,
  answers: FormValue,
) => {
  // If reviewer is old co-owner
  const ownerCoOwners = getValueViaPath(
    answers,
    'ownerCoOwners',
    [],
  ) as OwnerCoOwnersInformation[]

  const ownerCoOwner = ownerCoOwners.find(
    (x) => x.nationalId === reviewerNationalId,
  )
  if (ownerCoOwner) {
    return ownerCoOwner
  }

  // If reviewer is new co-owner
  const coOwners = getValueViaPath(
    answers,
    'coOwners',
    [],
  ) as CoOwnersInformation[]

  const coOwner = coOwners
    .filter(({ wasRemoved }) => wasRemoved !== 'true')
    .find((x) => x.nationalId === reviewerNationalId)
  if (coOwner) {
    return coOwner
  }

  return null
}
