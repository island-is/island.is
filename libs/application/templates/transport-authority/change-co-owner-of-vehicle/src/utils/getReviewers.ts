import { FormValue } from '@island.is/application/types'
import { getValueViaPath } from '@island.is/application/core'
import { CoOwnersInformation, OwnerCoOwnersInformation } from '../shared'

export const getReviewers = (
  answers: FormValue,
): { nationalId: string; name: string; hasApproved: boolean }[] => {
  const result: { nationalId: string; name: string; hasApproved: boolean }[] =
    []

  // Old co-owner
  const oldCoOwners = getValueViaPath(
    answers,
    'ownerCoOwners',
    [],
  ) as OwnerCoOwnersInformation[]
  oldCoOwners.forEach((item) => {
    if (item?.nationalId)
      result.push({
        nationalId: item.nationalId,
        name: item.name ?? '',
        hasApproved: item.approved ?? false,
      })
  })

  // New co-owner
  const newCoOwners = (
    getValueViaPath(answers, 'coOwners', []) as CoOwnersInformation[]
  ).filter(({ wasRemoved }) => wasRemoved !== 'true')
  newCoOwners.forEach((item) => {
    if (item?.nationalId)
      result.push({
        nationalId: item.nationalId,
        name: item.name ?? '',
        hasApproved: item.approved ?? false,
      })
  })

  return result
}
