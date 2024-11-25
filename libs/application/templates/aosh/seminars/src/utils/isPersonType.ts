import { getValueViaPath } from '@island.is/application/core'
import { ExternalData } from '@island.is/application/types'

export const isPersonType = (externalData: ExternalData) => {
  return (
    getValueViaPath<string>(externalData, 'identity.data.type') === 'person'
  )
}
