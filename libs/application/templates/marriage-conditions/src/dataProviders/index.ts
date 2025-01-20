import {
  InstitutionNationalIds,
  MockablePaymentCatalogApi,
  PaymentCatalogApi,
  defineTemplateApi,
} from '@island.is/application/types'

export {
  NationalRegistryUserApi,
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

// Having 2 payment catalog apis did not work so fetching catalog in template-api
export const NationalRegistryPaymentCatalogApi = defineTemplateApi({
  action: 'paymentNationalRegistry',
  externalDataId: 'paymentNationalRegistry',
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

export const MockableNationalRegistryPaymentCatalogApi =
  MockablePaymentCatalogApi.configure({
    params: {
      organizationId: InstitutionNationalIds.THJODSKRA,
    },
    externalDataId: 'paymentNationalRegistry',
  })
