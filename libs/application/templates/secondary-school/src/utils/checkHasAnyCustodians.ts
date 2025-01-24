import { getValueViaPath } from '@island.is/application/core'
import { ExternalData } from '@island.is/application/types'
import kennitala from 'kennitala'

export const checkHasAnyCustodians = (externalData: ExternalData): boolean => {
  // const custodian = getCustodian(externalData, 0)
  // return !!custodian
  return checkIsOfLegalAge(externalData)
}

// const getCustodian = (
//   externalData: ExternalData,
//   index: number,
// ): NationalRegistryParent | undefined => {
//   const custodians = getValueViaPath<NationalRegistryParent[]>(
//     externalData,
//     'nationalRegistryCustodians.data',
//   )
//   return custodians?.[index]
// }

const checkIsOfLegalAge = (externalData: ExternalData) => {
  const nationalId = getValueViaPath<string>(
    externalData,
    'nationalRegistry.data.nationalId',
  )
  const age = kennitala.info(nationalId || '').age
  return age < 18
}
