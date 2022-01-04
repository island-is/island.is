import {
  buildExternalDataProvider,
  buildDataProviderItem,
  buildSubSection,
} from '@island.is/application/core'
import { m } from '../../lib/messages'

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
          id: 'nationalRegistry',
          type: 'NationalRegistryProvider',
          title: m.nationalRegistryTitle,
          subTitle: m.nationalRegistrySubTitle,
        }),
        buildDataProviderItem({
          id: 'userProfile',
          type: 'UserProfileProvider',
          title: m.userProfileInformationTitle,
          subTitle: m.userProfileInformationSubTitle,
        }),
        buildDataProviderItem({
          id: 'currentLicense',
          type: 'CurrentLicenseProvider',
          title: m.infoFromLicenseRegistry,
          subTitle: m.confirmationStatusOfEligability,
        }),
        buildDataProviderItem({
          id: 'qualityPhoto',
          type: 'QualityPhotoProvider',
          title: '',
          subTitle: '',
        }),
        buildDataProviderItem({
          id: 'studentAssessment',
          type: 'DrivingAssessmentProvider',
          title: '',
        }),
        buildDataProviderItem({
          id: 'juristictions',
          type: 'JuristictionProvider',
          title: '',
        }),
        buildDataProviderItem({
          id: 'payment',
          type: 'FeeInfoProvider',
          title: '',
        }),
        buildDataProviderItem({
          id: 'teachers',
          type: 'TeachersProvider',
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
