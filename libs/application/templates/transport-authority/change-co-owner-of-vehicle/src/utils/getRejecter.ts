import { getValueViaPath } from '@island.is/application/core'
import { FormValue } from '@island.is/application/types'
import { OwnerCoOwnersInformation, Rejecter, UserInformation } from '../shared'

export const getRejecter = (reviewerNationalId: string, answers: FormValue) => {
  const plate = getValueViaPath(answers, 'pickVehicle.plate', '') as string

  const ownerCoOwners = getValueViaPath(
    answers,
    'ownerCoOwners',
    [],
  ) as OwnerCoOwnersInformation[]
  const ownerCoOwner = ownerCoOwners.find(
    (ownerCoOwner) => ownerCoOwner.nationalId === reviewerNationalId,
  )
  if (ownerCoOwner) {
    return {
      plate,
      name: ownerCoOwner.name,
      nationalId: ownerCoOwner.nationalId,
    } as Rejecter
  }

  const coOwners = getValueViaPath(answers, 'coOwners', []) as UserInformation[]
  const coOwner = coOwners.find(
    (coOwner) => coOwner.nationalId === reviewerNationalId,
  )
  if (coOwner) {
    return {
      plate,
      name: coOwner.name,
      nationalId: coOwner.nationalId,
    } as Rejecter
  }

  return undefined
}
