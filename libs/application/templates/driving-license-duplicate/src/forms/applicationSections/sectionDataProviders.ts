import {
  buildExternalDataProvider,
  buildDataProviderItem,
  buildSection,
} from '@island.is/application/core'
import { m } from '../../lib/messages'
import {
  CurrentLicenseApi,
  QualityPhotoApi,
  QualitySignatureApi,
} from '@island.is/application/types'

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
          provider: QualityPhotoApi,
          title: m.dataCollectionQualityPhotoTitle,
          subTitle: m.dataCollectionQualityPhotoSubtitle,
        }),
        buildDataProviderItem({
          provider: QualitySignatureApi,
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
          provider: CurrentLicenseApi,
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
