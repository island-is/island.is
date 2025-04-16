import { getValueViaPath } from '@island.is/application/core'
import { ExternalData, FormValue } from '@island.is/application/types'

export const isPersonType = (_: FormValue, externalData: ExternalData) => {
  return (
    getValueViaPath<string>(externalData, 'identity.data.type') === 'person'
  )
}
