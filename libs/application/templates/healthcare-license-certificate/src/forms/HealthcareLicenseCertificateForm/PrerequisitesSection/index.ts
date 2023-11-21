import {
  buildSection,
  buildExternalDataProvider,
  buildDataProviderItem,
} from '@island.is/application/core'
import { externalData } from '../../../lib/messages'
import {
  EmbaettiLandlaeknisPaymentCatalogApi,
  HealtcareLicenesApi,
  IdentityApi,
  UserProfileApi,
} from '../../../dataProviders'

export const PrerequisitesSection = buildSection({
  id: 'externalData',
  title: externalData.dataProvider.sectionTitle,
  children: [
    buildExternalDataProvider({
      title: externalData.dataProvider.pageTitle,
      id: 'approveExternalData',
      subTitle: externalData.dataProvider.subTitle,
      checkboxLabel: externalData.dataProvider.checkboxLabel,
      dataProviders: [
        buildDataProviderItem({
          provider: IdentityApi,
          title: externalData.nationalRegistry.title,
          subTitle: externalData.nationalRegistry.subTitle,
        }),
        buildDataProviderItem({
          provider: UserProfileApi,
          title: externalData.userProfile.title,
          subTitle: externalData.userProfile.subTitle,
        }),
        buildDataProviderItem({
          provider: HealtcareLicenesApi,
          title: externalData.healtcareLicenses.title,
          subTitle: externalData.healtcareLicenses.subTitle,
        }),
        buildDataProviderItem({
          provider: EmbaettiLandlaeknisPaymentCatalogApi,
          title: '',
        }),
      ],
    }),
  ],
})
