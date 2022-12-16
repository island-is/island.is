import {
  buildSection,
  buildExternalDataProvider,
  buildDataProviderItem,
} from '@island.is/application/core'
import {
  NationalRegistryUserApi,
  UserProfileApi,
} from '@island.is/application/types'
import { externalData } from '../../lib/messages'

export const prerequisitesSection = buildSection({
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
          provider: NationalRegistryUserApi,
          title: externalData.nationalRegistry.title,
          subTitle: externalData.nationalRegistry.subTitle,
        }),
        buildDataProviderItem({
          provider: UserProfileApi,
          title: externalData.userProfile.title,
          subTitle: externalData.userProfile.subTitle,
        }),
        buildDataProviderItem({
          id: 'drivingLicense',
          type: 'DrivingLicenseProvider',
          title: externalData.drivingLicense.title,
          subTitle: externalData.drivingLicense.subTitle,
        }),
        buildDataProviderItem({
          id: 'qualityPhotoAndSignature',
          type: 'QualityPhotoAndSignatureProvider',
          title: '',
        }),
        buildDataProviderItem({
          id: 'newestDriversCard',
          type: 'NewestDriversCardProvider',
          title: externalData.newestDriversCard.title,
          subTitle: externalData.newestDriversCard.subTitle,
        }),
        buildDataProviderItem({
          id: 'tachonetDriversCard',
          type: '', // Note: will leave empty since we need more information from user before getting data from TachoNet
          title: externalData.tachonetDriversCard.title,
          subTitle: externalData.tachonetDriversCard.subTitle,
        }),
        buildDataProviderItem({
          id: 'nationalRegistryCustom',
          type: 'NationalRegistryCustomProvider',
          title: '',
        }),
        buildDataProviderItem({
          id: 'payment',
          type: 'PaymentChargeInfoProvider',
          title: '',
        }),
      ],
    }),
  ],
})
