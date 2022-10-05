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
  PaymentCatalogApi,
  CurrentLicenseApi,
  DrivingAssessmentApi,
  JuristictionApi,
  QualityPhotoApi,
} from '@island.is/application/types'
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
          provider: QualityPhotoApi,
          title: '',
          subTitle: '',
        }),
        buildDataProviderItem({
          provider: DrivingAssessmentApi,
          title: '',
        }),
        buildDataProviderItem({
          provider: JuristictionApi,
          title: '',
        }),
        buildDataProviderItem({
          provider: PaymentCatalogApi,
          title: '',
        }),
        buildDataProviderItem({
          provider: TeachersApi,
          title: '',
        }),
        buildDataProviderItem({
          id: 'existingApplication',
          type: 'ExistingApplicationProvider',
          title: '',
        }),
      ],
    }),
  ],
})
