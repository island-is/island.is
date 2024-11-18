import {
  defineTemplateApi,
  InstitutionNationalIds,
  MockablePaymentCatalogApi,
  PaymentCatalogApi,
} from '@island.is/application/types'

export { IdentityApi } from '@island.is/application/types'

export const SamgongustofaPaymentCatalogApi = PaymentCatalogApi.configure({
  params: {
    organizationId: InstitutionNationalIds.SAMGONGUSTOFA,
  },
  externalDataId: 'payment',
})

export const MockableSamgongustofaPaymentCatalogApi =
  MockablePaymentCatalogApi.configure({
    params: {
      organizationId: InstitutionNationalIds.SAMGONGUSTOFA,
    },
    externalDataId: 'payment',
  })

export const MyPlateOwnershipsApi = defineTemplateApi({
  action: 'getMyPlateOwnershipList',
  externalDataId: 'myPlateOwnershipList',
})
