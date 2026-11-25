import {
  ApplicationTypes,
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

export const GlassesCheckApi = defineTemplateApi({
  namespace: ApplicationTypes.DRIVING_LICENSE,
  action: 'glassesCheck',
})

// Per-type eligibility gate on the external-data step. order: 1 runs it after
// the license/photo providers (order 0) so its backend action can read the
// fetched current license and photos. Stores a per-type map under
// `externalData.eligibility` that the applicationFor radio reads to disable
// ineligible types, and throws a user-facing error when no type is eligible.
export const EligibilityApi = defineTemplateApi({
  namespace: ApplicationTypes.DRIVING_LICENSE,
  action: 'checkEligibility',
  externalDataId: 'eligibility',
  order: 1,
})
