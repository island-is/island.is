import { getValueViaPath } from '@island.is/application/core'
import { ExternalData } from '@island.is/application/types'
import { Fasteign } from '@island.is/clients/assets'

export const hasTwentyOrMoreProperties = (externalData: ExternalData) => {
  const properties =
    getValueViaPath<Array<Fasteign>>(externalData, 'getProperties.data', []) ||
    []

  return properties.length < 19 ? true : false
}
