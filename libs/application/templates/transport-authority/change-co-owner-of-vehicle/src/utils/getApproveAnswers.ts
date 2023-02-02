import { getValueViaPath } from '@island.is/application/core'
import { FormValue } from '@island.is/application/types'
import { UserInformation, OwnerCoOwnersInformation } from '../shared'

export const getApproveAnswers = (
  reviewerNationalId: string,
  answers: FormValue,
) => {
  // If reviewer is owners coowner
  const ownerCoOwners = getValueViaPath(
    answers,
    'ownerCoOwner',
    [],
  ) as OwnerCoOwnersInformation[]
  const ownerCoOwner = ownerCoOwners.find(
    (ownerCoOwner) => ownerCoOwner.nationalId === reviewerNationalId,
  )
  if (ownerCoOwner) {
    return {
      ownerCoOwners: ownerCoOwners.map((ownerCoOwner) => {
        return {
          nationalId: ownerCoOwner.nationalId,
          name: ownerCoOwner.name,
          email: ownerCoOwner.email,
          phone: ownerCoOwner.phone,
          startDate: ownerCoOwner.startDate,
          wasRemoved: ownerCoOwner.wasRemoved,
          approved:
            ownerCoOwner.nationalId === reviewerNationalId
              ? true
              : ownerCoOwner.approved || false,
        }
      }),
    }
  }

  // If reviewer is coowner
  const coOwners = getValueViaPath(answers, 'coOwners', []) as UserInformation[]
  const currentCoOwner = coOwners.find(
    (coOwner) => coOwner.nationalId === reviewerNationalId,
  )
  if (currentCoOwner) {
    return {
      coOwners: coOwners.map((coOwner) => {
        return {
          nationalId: coOwner.nationalId,
          name: coOwner.name,
          email: coOwner.email,
          phone: coOwner.phone,
          approved:
            coOwner.nationalId === reviewerNationalId
              ? true
              : coOwner.approved || false,
        }
      }),
    }
  }

  return {}
}
