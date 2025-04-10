import { getValueViaPath } from '@island.is/application/core'
import {
  ExternalData,
  NationalRegistryCustodian,
} from '@island.is/application/types'

export const getCustodian = (
  externalData: ExternalData,
  index: number,
): NationalRegistryCustodian | undefined => {
  const custodians = getValueViaPath<NationalRegistryCustodian[]>(
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

export const checkHasAnyCustodians = (externalData: ExternalData): boolean => {
  return getHasCustodian(externalData, 0)
}
