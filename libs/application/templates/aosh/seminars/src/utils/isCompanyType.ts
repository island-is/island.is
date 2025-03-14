import { getValueViaPath } from '@island.is/application/core'
import { ExternalData } from '@island.is/application/types'
import { IndividualOrCompany } from '../shared/constants'

export const isCompanyType = (externalData: ExternalData) => {
  return (
    getValueViaPath<string>(externalData, 'identity.data.type') ===
    IndividualOrCompany.company
  )
}
