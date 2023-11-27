import {
  buildExternalDataProvider,
  buildDataProviderItem,
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
import { SyslumadurPaymentCatalogApi } from '../../dataProviders'

export const sectionDataProviders = buildExternalDataProvider({
  id: 'approveExternalData',
  title: m.dataCollectionTitle,
  subTitle: m.dataCollectionSubtitle,
  description: m.dataCollectionDescription,
  checkboxLabel: m.dataCollectionCheckboxLabel,
  dataProviders: [
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
      provider: QualitySignatureApi,
      title: '',
      subTitle: '',
    }),
    buildDataProviderItem({
      provider: UserProfileApi,
      title: m.dataCollectionUserProfileTitle,
      subTitle: m.dataCollectionUserProfileSubtitle,
    }),
    buildDataProviderItem({
      provider: JurisdictionApi,
      title: '',
      subTitle: '',
    }),
    buildDataProviderItem({
      provider: CurrentLicenseApi,
      title: '',
      subTitle: '',
    }),
    buildDataProviderItem({
      provider: SyslumadurPaymentCatalogApi,
      title: '',
    }),
  ],
})
