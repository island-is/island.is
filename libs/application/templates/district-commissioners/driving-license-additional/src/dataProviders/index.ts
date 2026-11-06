import {
  defineTemplateApi,
  InstitutionNationalIds,
  MockablePaymentCatalogApi,
  PaymentCatalogApi,
} from '@island.is/application/types'
export {
  NationalRegistryV3UserApi,
  HasTeachingRightsApi,
  UserProfileApi,
  CurrentLicenseApi,
  DrivingAssessmentApi,
  JurisdictionApi,
  QualityPhotoApi,
  ExistingApplicationApi,
} from '@island.is/application/types'

export const SyslumadurPaymentCatalogApi = PaymentCatalogApi.configure({
  params: {
    organizationId: InstitutionNationalIds.SYSLUMENN,
  },
  externalDataId: 'payment',
})

export const MockableSyslumadurPaymentCatalogApi =
  MockablePaymentCatalogApi.configure({
    params: {
      organizationId: InstitutionNationalIds.SYSLUMENN,
    },
    externalDataId: 'payment',
  })

// Eligibility gate on the external-data step. order: 1 runs it after
// CurrentLicense (order 0) so it can read the fetched license. Its backend
// action throws a user-facing error when the applicant doesn't meet the
// requirements, which the data-gathering screen shows and blocks progression.
export const EligibilityApi = defineTemplateApi({
  action: 'checkEligibility',
  order: 1,
})
