import { getValueViaPath } from '@island.is/application/core'
import type { ExternalData } from '@island.is/application/types'
import { IndividualOrCompany } from './constants'

export const isCompanyType = (externalData: ExternalData) => {
  return (
    getValueViaPath<IndividualOrCompany>(externalData, 'identity.data.type') ===
    IndividualOrCompany.company
  )
}
