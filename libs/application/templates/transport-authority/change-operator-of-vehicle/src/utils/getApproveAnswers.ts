import { getValueViaPath } from '@island.is/application/core'
import { FormValue } from '@island.is/application/types'
import { UserInformation, OperatorInformation } from '../shared'

export const getApproveAnswers = (
  reviewerNationalId: string,
  answers: FormValue,
) => {
  // If reviewer is owners coowner
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
      ownerCoOwners: ownerCoOwners.map((ownerCoOwner) => {
        return {
          nationalId: ownerCoOwner.nationalId,
          name: ownerCoOwner.name,
          email: ownerCoOwner.email,
          phone: ownerCoOwner.phone,
          approved:
            ownerCoOwner.nationalId === reviewerNationalId
              ? true
              : ownerCoOwner.approved || false,
        }
      }),
    }
  }

  // If reviewer is operator
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
      operators: operators.map((operator) => {
        return {
          nationalId: operator.nationalId,
          name: operator.name,
          email: operator.email,
          phone: operator.phone,
          wasRemoved: operator.wasRemoved,
          approved:
            operator.nationalId === reviewerNationalId
              ? true
              : operator.approved || false,
        }
      }),
    }
  }

  return {}
}
