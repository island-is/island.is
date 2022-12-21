import { getValueViaPath } from '@island.is/application/core'
import { FormValue } from '@island.is/application/types'
import { OperatorInformation, Rejecter, UserInformation } from '../shared'

export const getRejecter = (reviewerNationalId: string, answers: FormValue) => {
  const plate = getValueViaPath(answers, 'pickVehicle.plate', '') as string

  const ownerCoOwners = getValueViaPath(
    answers,
    'ownerCoOwner',
    [],
  ) as UserInformation[]
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

  const operators = getValueViaPath(
    answers,
    'operators',
    [],
  ) as OperatorInformation[]
  const operator = operators.find(
    (operator) => operator.nationalId === reviewerNationalId,
  )
  if (operator) {
    return {
      plate,
      name: operator.name,
      nationalId: operator.nationalId,
    } as Rejecter
  }

  return undefined
}
