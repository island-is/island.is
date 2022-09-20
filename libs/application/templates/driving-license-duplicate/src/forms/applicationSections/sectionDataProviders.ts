import {
  buildExternalDataProvider,
  buildDataProviderItem,
  buildSection,
} from '@island.is/application/core'
import { m } from '../../lib/messages'

export const sectionDataProviders = buildSection({
  id: 'externalData',
  title: m.dataCollectionTitle,
  children: [
    buildExternalDataProvider({
      id: 'approveExternalData',
      title: m.dataCollectionTitle,
      subTitle: m.dataCollectionSubtitle,
      description: m.dataCollectionDescription,
      checkboxLabel: m.dataCollectionCheckboxLabel,
      dataProviders: [
        buildDataProviderItem({
          id: 'nationalRegistry',
          type: 'NationalRegistryProvider',
          title: m.dataCollectionNationalRegistryTitle,
          subTitle: m.dataCollectionNationalRegistrySubtitle,
        }),
        buildDataProviderItem({
          id: 'qualityPhoto',
          type: 'QualityPhotoProvider',
          title: m.dataCollectionQualityPhotoTitle,
          subTitle: m.dataCollectionQualityPhotoSubtitle,
        }),
        buildDataProviderItem({
          id: 'qualitySignature',
          type: 'QualitySignatureProvider',
          title: '',
          subTitle: '',
        }),
        buildDataProviderItem({
          id: 'userProfile',
          type: 'UserProfileProvider',
          title: m.dataCollectionUserProfileTitle,
          subTitle: m.dataCollectionUserProfileSubtitle,
        }),
        buildDataProviderItem({
          id: 'districts',
          type: 'DistrictsProvider',
          title: '',
          subTitle: '',
        }),
        buildDataProviderItem({
          id: 'currentLicense',
          type: 'CurrentLicenseProvider',
          title: '',
          subTitle: '',
        }),
        buildDataProviderItem({
          id: 'payment',
          type: 'FeeInfoProvider',
          title: '',
        }),
      ],
    }),
  ],
})
