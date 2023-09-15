import { FormValue } from '@island.is/application/types'
import { getValueViaPath } from '@island.is/application/core'
import { CoOwnersInformation, OwnerCoOwnersInformation } from '../shared'

export const hasReviewerApproved = (
  reviewerNationalId: string,
  answers: FormValue,
) => {
  // Check if reviewer is old co-owner and has not approved
  const ownerCoOwners = getValueViaPath(
    answers,
    'ownerCoOwners',
    [],
  ) as OwnerCoOwnersInformation[]
  const ownerCoOwner = ownerCoOwners.find(
    (x) => x.nationalId === reviewerNationalId,
  )
  if (ownerCoOwner) {
    const hasApproved = ownerCoOwner?.approved || false
    if (!hasApproved) return false
  }

  // Check if reviewer is new co-owner and has not approved
  const coOwners = getValueViaPath(
    answers,
    'coOwners',
    [],
  ) as CoOwnersInformation[]
  const coOwner = coOwners
    .filter(({ wasRemoved }) => wasRemoved !== 'true')
    .find((x) => x.nationalId === reviewerNationalId)
  if (coOwner) {
    const hasApproved = coOwner?.approved || false
    if (!hasApproved) return false
  }

  return true
}
