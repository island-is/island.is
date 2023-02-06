import { getValueViaPath } from '@island.is/application/core'
import { FormValue } from '@island.is/application/types'
import { OwnerCoOwnersInformation, UserInformation } from '../shared'

export const isLastReviewer = (
  reviewerNationalId: string,
  answers: FormValue,
) => {
  // First check if any reviewer that is not the current user has not approved
  const ownerCoOwners = getValueViaPath(
    answers,
    'ownerCoOwner',
    [],
  ) as OwnerCoOwnersInformation[]
  const approvedOwnerCoOwner = ownerCoOwners.find((ownerCoOwner) => {
    return (
      ownerCoOwner.nationalId !== reviewerNationalId && !ownerCoOwner.approved
    )
  })
  if (approvedOwnerCoOwner) {
    return false
  }

  const coOwners = getValueViaPath(answers, 'coOwners', []) as UserInformation[]
  const approvedCoOwner = coOwners.find(
    (coOwner) => coOwner.nationalId !== reviewerNationalId && !coOwner.approved,
  )
  if (approvedCoOwner) {
    return false
  }

  return true
}
