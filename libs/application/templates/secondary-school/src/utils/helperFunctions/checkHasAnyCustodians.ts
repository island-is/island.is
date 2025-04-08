import { getValueViaPath } from '@island.is/application/core'
import { ExternalData } from '@island.is/application/types'
import kennitala from 'kennitala'

export const checkHasAnyCustodians = (externalData: ExternalData): boolean => {
  return !checkIsOfLegalAge(externalData)
}

const checkIsOfLegalAge = (externalData: ExternalData) => {
  const nationalId = getValueViaPath<string>(
    externalData,
    'nationalRegistry.data.nationalId',
  )
  const age = kennitala.info(nationalId || '').age
  return age >= 18
}
