import {
  buildExternalDataProvider,
  buildDataProviderItem,
  buildSubmitField,
  buildSubSection,
} from '@island.is/application/core'
import { m } from '../../lib/messages'
import {
  DefaultEvents,
  NationalRegistryV3UserApi,
  TeachersApi,
  UserProfileApi,
  CurrentLicenseApi,
  DrivingAssessmentApi,
  JurisdictionApi,
  QualityPhotoAndSignatureApi,
  AllPhotosFromThjodskraApi,
} from '@island.is/application/types'
import {
  EligibilityApi,
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
      submitField: buildSubmitField({
        id: 'submit',
        placement: 'footer',
        refetchApplicationAfterSubmit: true,
        actions: [
          {
            event: DefaultEvents.SUBMIT,
            name: m.continue,
            type: 'primary',
          },
        ],
      }),
      dataProviders: [
        buildDataProviderItem({
          provider: NationalRegistryV3UserApi,
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
          provider: AllPhotosFromThjodskraApi,
        }),
        buildDataProviderItem({
          provider: QualityPhotoAndSignatureApi,
        }),
        // Silent eligibility gate — surfaces only as an error on this screen when
        // the applicant can't apply for any license type, blocking entry to the
        // draft state. Runs last (order 1) so it can read the fetched license and
        // photos.
        buildDataProviderItem({
          provider: EligibilityApi,
        }),
      ],
    }),
  ],
})
