import {
  buildExternalDataProvider,
  buildDataProviderItem,
  buildSubSection,
} from '@island.is/application/core'
import { m } from '../../lib/messages'
import {
  NationalRegistryUserApi,
  TeachersApi,
  UserProfileApi,
  CurrentLicenseApi,
  DrivingAssessmentApi,
  JurisdictionApi,
  QualityPhotoApi,
  ExistingApplicationApi,
} from '@island.is/application/types'
import {
  GlassesCheckApi,
  MockableSyslumadurPaymentCatalogApi,
  SyslumadurPaymentCatalogApi,
} from '../../dataProviders'
export const sectionExternalData = buildSubSection({
  id: 'externalData',
  title: m.externalDataSection,
  children: [
    buildExternalDataProvider({
      title: m.externalDataTitle,
      id: 'approveExternalData',
      subTitle: m.externalDataSubTitle,
      checkboxLabel: m.externalDataAgreement,
      dataProviders: [
        buildDataProviderItem({
          provider: NationalRegistryUserApi,
          title: m.nationalRegistryTitle,
          subTitle: m.nationalRegistrySubTitle,
        }),
        buildDataProviderItem({
          provider: UserProfileApi,
          title: m.userProfileInformationTitle,
          subTitle: m.userProfileInformationSubTitle,
        }),
        buildDataProviderItem({
          provider: CurrentLicenseApi,
          title: m.infoFromLicenseRegistry,
          subTitle: m.confirmationStatusOfEligability,
        }),
        buildDataProviderItem({
          provider: GlassesCheckApi,
          subTitle: '',
        }),
        buildDataProviderItem({
          provider: QualityPhotoApi,
          subTitle: '',
        }),
        buildDataProviderItem({
          provider: DrivingAssessmentApi,
        }),
        buildDataProviderItem({
          provider: JurisdictionApi,
        }),
        buildDataProviderItem({
          provider: SyslumadurPaymentCatalogApi,
        }),
        buildDataProviderItem({
          provider: MockableSyslumadurPaymentCatalogApi,
        }),
        buildDataProviderItem({
          provider: TeachersApi,
        }),
        buildDataProviderItem({
          provider: ExistingApplicationApi,
        }),
      ],
    }),
  ],
})
