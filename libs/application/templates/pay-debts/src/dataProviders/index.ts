import {
  defineTemplateApi,
  InstitutionNationalIds,
  MockablePaymentCatalogApi,
} from '@island.is/application/types'

export const GetDebtsApi = defineTemplateApi({
  action: 'getCustomerDebts',
  externalDataId: 'customerDebts',
  namespace: 'PayDebts',
})

export const MockPaymentCatalog = MockablePaymentCatalogApi.configure({
  params: {
    organizationId: InstitutionNationalIds.FJARSYSLA_RIKISINS,
    enableMockPayment: true,
  },
  externalDataId: 'payment',
})
