import { FormValue } from '@island.is/application/types'
import { getValueViaPath } from '@island.is/application/core'
import { OperatorInformation, UserInformation } from '../shared'

export const getReviewers = (
  answers: FormValue,
): { nationalId: string; name: string; hasApproved: boolean }[] => {
  const result: { nationalId: string; name: string; hasApproved: boolean }[] =
    []

  // Co-owner
  const coOwners = getValueViaPath(
    answers,
    'ownerCoOwner',
    [],
  ) as UserInformation[]
  coOwners.forEach((item) => {
    if (item?.nationalId)
      result.push({
        nationalId: item.nationalId,
        name: item.name,
        hasApproved: item.approved ?? false,
      })
  })

  // New operator
  const newOperators = (
    getValueViaPath(answers, 'operators', []) as OperatorInformation[]
  ).filter(({ wasRemoved }) => wasRemoved !== 'true')
  newOperators.forEach((item) => {
    if (item?.nationalId)
      result.push({
        nationalId: item.nationalId,
        name: item.name ?? '',
        hasApproved: item.approved ?? false,
      })
  })

  return result
}
