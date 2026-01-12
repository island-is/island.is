import { getValueViaPath, NO, YES } from '@island.is/application/core'
import { FormValue } from '@island.is/application/types'

export const isOwnerOtherThanImporter = (answers: FormValue) => {
  const isOwnerOtherThanImporter = getValueViaPath(
    answers,
    'ownerInformation.isOwnerOtherThanImporter',
    NO,
  ) as typeof NO | typeof YES

  return isOwnerOtherThanImporter === YES
}
