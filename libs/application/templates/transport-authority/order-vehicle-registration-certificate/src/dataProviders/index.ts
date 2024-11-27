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

interface CurrentVehiclesParameters {
  showOwned?: boolean
  showCoOwned?: boolean
  showOperated?: boolean
}
export const CurrentVehiclesApi = defineTemplateApi<CurrentVehiclesParameters>({
  action: 'currentVehicles',
  externalDataId: 'currentVehicleList',
  namespace: 'VehiclesShared',
  params: {
    showOwned: true,
    showCoOwned: true,
  },
})
