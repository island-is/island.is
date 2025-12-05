import { FormValue } from '@island.is/application/types'
import { getValueViaPath } from '@island.is/application/core'
import { OperatorInformation, UserInformation } from '../shared'

export const getReviewers = (
  answers: FormValue,
): { nationalId: string; name: string; hasApproved: boolean }[] => {
  const result: { nationalId: string; name: string; hasApproved: boolean }[] =
    []

  // Co-owner
  const coOwners =
    getValueViaPath<UserInformation[]>(answers, 'ownerCoOwner') || []
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
    getValueViaPath<OperatorInformation[]>(answers, 'operators') || []
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

export const getReviewerRole = (
  answers: FormValue,
  nationalId: string,
): 'ownerCoOwner' | 'operators' | undefined => {
  // Co-owner
  const ownerCoOwner = getValueViaPath<UserInformation[]>(
    answers,
    'ownerCoOwner',
  )
  if (ownerCoOwner?.map((x) => x.nationalId)?.includes(nationalId))
    return 'ownerCoOwner'

  // New operator
  const operators = getValueViaPath<OperatorInformation[]>(
    answers,
    'operators',
  )?.filter(({ wasRemoved }) => wasRemoved !== 'true')
  if (operators?.map((x) => x.nationalId)?.includes(nationalId))
    return 'operators'
}
