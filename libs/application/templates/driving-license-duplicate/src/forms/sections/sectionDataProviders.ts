import {
  buildExternalDataProvider,
  buildDataProviderItem,
  buildSection,
} from '@island.is/application/core'
import { m } from '../../lib/messages'
import {
  CurrentLicenseApi,
  JurisdictionApi,
  QualityPhotoApi,
  AllPhotosFromThjodskraApi,
  NationalRegistryUserApi,
  UserProfileApi,
} from '@island.is/application/types'
import {
  DuplicateEligibilityApi,
  MockableSyslumadurPaymentCatalogApi,
  SyslumadurPaymentCatalogApi,
} from '../../dataProviders'

export const sectionDataProviders = (
  allowFakeData: boolean,
  allowThjodskraPhotos: boolean,
) =>
  buildSection({
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
            // on dev, skip this data provider for test purposes
            provider: allowFakeData ? undefined : NationalRegistryUserApi,
            title: m.dataCollectionNationalRegistryTitle,
            subTitle: m.dataCollectionNationalRegistrySubtitle,
          }),
          buildDataProviderItem({
            provider: QualityPhotoApi,
            title: m.dataCollectionQualityPhotoTitle,
            subTitle: m.dataCollectionQualityPhotoSubtitle,
          }),
          buildDataProviderItem({
            provider: allowThjodskraPhotos
              ? AllPhotosFromThjodskraApi
              : undefined,
          }),
          buildDataProviderItem({
            provider: DuplicateEligibilityApi,
          }),
          buildDataProviderItem({
            provider: allowFakeData ? undefined : UserProfileApi,
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
