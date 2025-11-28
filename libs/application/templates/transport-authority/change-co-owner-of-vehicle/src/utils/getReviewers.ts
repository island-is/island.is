import { FormValue } from '@island.is/application/types'
import { getValueViaPath } from '@island.is/application/core'
import { CoOwnersInformation, OwnerCoOwnersInformation } from '../shared'

export const getReviewers = (
  answers: FormValue,
): { nationalId: string; name: string; hasApproved: boolean }[] => {
  const result: { nationalId: string; name: string; hasApproved: boolean }[] =
    []

  // Old co-owner
  const oldCoOwners =
    getValueViaPath<OwnerCoOwnersInformation[]>(answers, 'ownerCoOwners') || []
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
    getValueViaPath<CoOwnersInformation[]>(answers, 'coOwners') || []
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

export const getReviewerRole = (
  answers: FormValue,
  nationalId: string,
): 'ownerCoOwners' | 'coOwners' | undefined => {
  // Old co-owner
  const ownerCoOwners = getValueViaPath<OwnerCoOwnersInformation[]>(
    answers,
    'ownerCoOwners',
  )
  if (ownerCoOwners?.map((x) => x.nationalId)?.includes(nationalId))
    return 'ownerCoOwners'

  // New co-owner
  const coOwners = getValueViaPath<CoOwnersInformation[]>(
    answers,
    'coOwners',
  )?.filter(({ wasRemoved }) => wasRemoved !== 'true')
  if (coOwners?.map((x) => x.nationalId)?.includes(nationalId))
    return 'coOwners'
}
