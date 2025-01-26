import { getValueViaPath } from '@island.is/application/core'
import {
  ExternalData,
  NationalRegistryParent,
} from '@island.is/application/types'

export const getParent = (
  externalData: ExternalData,
  index: number,
): NationalRegistryParent | undefined => {
  const parents = getValueViaPath<NationalRegistryParent[]>(
    externalData,
    'nationalRegistryParents.data',
  )
  return parents?.[index]
}

export const getHasParent = (
  externalData: ExternalData,
  index: number,
): boolean => {
  const parent = getParent(externalData, index)
  return !!parent
}
