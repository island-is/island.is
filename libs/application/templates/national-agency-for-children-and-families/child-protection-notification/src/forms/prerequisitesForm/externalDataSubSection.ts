import {
  buildDataProviderItem,
  buildExternalDataProvider,
  buildSubSection,
} from '@island.is/application/core'
import { UserProfileApi } from '@island.is/application/types'
import {
  CategoriesApi,
  GendersApi,
  IdentityApiProvider,
  PostalCodesApi,
  ProtectiveFactorsApi,
} from '../../dataProviders'
import { prerequisitesMessages } from '../../lib/messages'

export const externalDataSubSection = buildSubSection({
  id: 'externalDataSubSection',
  title: prerequisitesMessages.externalData.subSectionTitle,
  children: [
    buildExternalDataProvider({
      id: 'approveExternalData',
      title: prerequisitesMessages.externalData.subSectionTitle,
      subTitle: prerequisitesMessages.externalData.description,
      checkboxLabel: prerequisitesMessages.externalData.checkboxProvider,
      dataProviders: [
        buildDataProviderItem({
          provider: UserProfileApi,
          title: 'User profile',
          subTitle: 'User profile',
        }),
        buildDataProviderItem({
          // TODO: Update text when external data is implemented
          provider: IdentityApiProvider,
          title: 'Identity info',
          subTitle: 'Identity info',
        }),
        buildDataProviderItem({
          provider: CategoriesApi,
        }),
        buildDataProviderItem({
          provider: ProtectiveFactorsApi,
        }),
        buildDataProviderItem({
          provider: GendersApi,
        }),
        buildDataProviderItem({
          provider: PostalCodesApi,
        }),
      ],
    }),
  ],
})
