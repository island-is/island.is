import {
  InstitutionNationalIds,
  MockablePaymentCatalogApi,
  PaymentCatalogApi,
  defineTemplateApi,
} from '@island.is/application/types'

export {
  NationalRegistryV3UserApi,
  UserProfileApi,
  DistrictsApi,
} from '@island.is/application/types'

export const MaritalStatusApi = defineTemplateApi({
  action: 'maritalStatus',
})

export const ReligionCodesApi = defineTemplateApi({
  action: 'religionCodes',
  externalDataId: 'religions',
})

export const DistrictCommissionersPaymentCatalogApi =
  PaymentCatalogApi.configure({
    params: {
      organizationId: InstitutionNationalIds.SYSLUMENN,
    },
    externalDataId: 'paymentDistrictCommissioners',
  })

export const BirthCertificateApi = defineTemplateApi({
  action: 'birthCertificate',
})

export const MockableDistrictCommissionersPaymentCatalogApi =
  MockablePaymentCatalogApi.configure({
    params: {
      organizationId: InstitutionNationalIds.SYSLUMENN,
    },
    externalDataId: 'paymentDistrictCommissioners',
  })
