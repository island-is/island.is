import {
  defineTemplateApi,
  InstitutionNationalIds,
  MockablePaymentCatalogApi,
  PaymentCatalogApi,
  PhotoLookupCheckApi,
} from '@island.is/application/types'
export {
  NationalRegistryV3UserApi,
  HasTeachingRightsApi,
  UserProfileApi,
  CurrentLicenseApi,
  DrivingAssessmentApi,
  JurisdictionApi,
  QualityPhotoApi,
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
  action: 'glassesCheck',
})

export const DrivingLicensePhotoLookupCheckApi = PhotoLookupCheckApi.configure({
  params: {
    rlsPhotoSource: 'qualityPhotoAndSignature',
  },
})
