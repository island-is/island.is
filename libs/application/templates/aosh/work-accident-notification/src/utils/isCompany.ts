import { getValueViaPath } from '@island.is/application/core'
import { ExternalData } from '@island.is/application/types'

export const isCompany = (externalData: ExternalData) => {
  const type = getValueViaPath<string>(externalData, 'identity.data.type')
  return type === 'company'
}
