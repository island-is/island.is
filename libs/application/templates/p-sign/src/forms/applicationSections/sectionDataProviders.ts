import {
  buildExternalDataProvider,
  buildDataProviderItem,
  buildSection,
} from '@island.is/application/core'
import {
  NationalRegistryUserApi,
  UserProfileApi,
  DistrictsApi,
  QualityPhotoApi,
} from '@island.is/application/types'
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
          id: 'doctorsNote',
          type: 'DoctorsNoteProvider',
          title: m.dataCollectionDoctorsNoteTitle,
          subTitle: m.dataCollectionDoctorsNoteSubtitle,
        }),
        buildDataProviderItem({
          provider: NationalRegistryUserApi,
          title: m.dataCollectionNationalRegistryTitle,
          subTitle: m.dataCollectionNationalRegistrySubtitle,
        }),
        buildDataProviderItem({
          provider: QualityPhotoApi,
          title: m.dataCollectionQualityPhotoTitle,
          subTitle: m.dataCollectionQualityPhotoSubtitle,
        }),
        buildDataProviderItem({
          provider: UserProfileApi,
          title: m.dataCollectionUserProfileTitle,
          subTitle: m.dataCollectionUserProfileSubtitle,
        }),
        buildDataProviderItem({
          provider: DistrictsApi,
          title: '',
          subTitle: '',
        }),
      ],
    }),
  ],
})
