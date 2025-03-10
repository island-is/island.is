import {
  buildSection,
  buildExternalDataProvider,
  buildDataProviderItem,
} from '@island.is/application/core'
import { externalData } from '../../../lib/messages'
import {
  NationalRegistryUserApi,
  UserProfileApi,
  SamgongustofaPaymentCatalogApi,
  DrivingLicenseApi,
  QualityPhotoAndSignatureApi,
  NewestDriversCardApi,
  NationalRegistryBirthplaceApi,
  MockableSamgongustofaPaymentCatalogApi,
} from '../../../dataProviders'

export const externalDataSection = buildSection({
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
          provider: NationalRegistryBirthplaceApi,
          title: '',
        }),
        buildDataProviderItem({
          provider: UserProfileApi,
          title: externalData.userProfile.title,
          subTitle: externalData.userProfile.subTitle,
        }),
        buildDataProviderItem({
          provider: DrivingLicenseApi,
          title: externalData.drivingLicense.title,
          subTitle: externalData.drivingLicense.subTitle,
        }),
        buildDataProviderItem({
          provider: QualityPhotoAndSignatureApi,
          title: '',
        }),
        buildDataProviderItem({
          provider: NewestDriversCardApi,
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
          provider: SamgongustofaPaymentCatalogApi,
          title: '',
        }),
        buildDataProviderItem({
          provider: MockableSamgongustofaPaymentCatalogApi,
          title: '',
        }),
      ],
    }),
  ],
})
