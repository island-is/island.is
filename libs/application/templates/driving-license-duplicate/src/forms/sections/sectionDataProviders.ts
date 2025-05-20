import {
  buildExternalDataProvider,
  buildDataProviderItem,
  buildSection,
} from '@island.is/application/core'
import { m } from '../../lib/messages'
import {
  CurrentLicenseApi,
  JurisdictionApi,
  NationalRegistryUserApi,
  QualityPhotoApi,
  QualitySignatureApi,
  UserProfileApi,
} from '@island.is/application/types'
import {
  DuplicateEligibilityApi,
  MockableSyslumadurPaymentCatalogApi,
  SyslumadurPaymentCatalogApi,
} from '../../dataProviders'

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
      enableMockPayment: true,
      dataProviders: [
        buildDataProviderItem({
          //provider: MockableNationalRegistry,
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
        }),
        buildDataProviderItem({
          provider: DuplicateEligibilityApi,
        }),
        buildDataProviderItem({
          provider: UserProfileApi,
          title: m.dataCollectionUserProfileTitle,
          subTitle: m.dataCollectionUserProfileSubtitle,
        }),
        buildDataProviderItem({
          provider: JurisdictionApi,
        }),
        buildDataProviderItem({
          provider: CurrentLicenseApi,
        }),
        buildDataProviderItem({
          provider: SyslumadurPaymentCatalogApi,
        }),
        buildDataProviderItem({
          provider: MockableSyslumadurPaymentCatalogApi,
        }),
      ],
    }),
  ],
})
