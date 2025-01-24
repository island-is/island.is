import { getValueViaPath } from '@island.is/application/core'
import {
  ExternalData,
  NationalRegistryParent,
} from '@island.is/application/types'

export const getCustodian = (
  externalData: ExternalData,
  index: number,
): NationalRegistryParent | undefined => {
  const custodians = getValueViaPath<NationalRegistryParent[]>(
    externalData,
    'nationalRegistryCustodians.data',
  )
  return custodians?.[index]
}

export const getHasCustodian = (
  externalData: ExternalData,
  index: number,
): boolean => {
  const custodian = getCustodian(externalData, index)
  return !!custodian
}
