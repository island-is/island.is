import { ApplicationTypes } from '@island.is/application/types'
import { CollectionType } from '@island.is/clients/signature-collection'

export const getCollectionTypeFromApplicationType = (
  applicationType: ApplicationTypes,
) => {
  switch (applicationType) {
    case ApplicationTypes.MUNICIPAL_LIST_SIGNING:
    case ApplicationTypes.MUNICIPAL_LIST_CREATION:
      return CollectionType.LocalGovernmental

    case ApplicationTypes.PRESIDENTIAL_LIST_SIGNING:
    case ApplicationTypes.PRESIDENTIAL_LIST_CREATION:
      return CollectionType.Presidential

    case ApplicationTypes.PARLIAMENTARY_LIST_SIGNING:
    case ApplicationTypes.PARLIAMENTARY_LIST_CREATION:
      return CollectionType.Parliamentary

    default:
      return CollectionType.OtherUnknown
  }
}
