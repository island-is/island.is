import {
  defineTemplateApi,
  PaymentCatalogApi,
} from '@island.is/application/types'

const SAMGONGUSTOFA_NATIONAL_ID = '5405131040'

export const SamgongustofaPaymentCatalogApi = PaymentCatalogApi.configure({
  params: {
    organizationId: SAMGONGUSTOFA_NATIONAL_ID,
  },
  externalDataId: 'payment',
})

export const CurrentVehiclesApi = defineTemplateApi({
  action: 'getCurrentVehiclesWithPlateOrderChecks',
  externalDataId: 'currentVehicleList',
})

export const DeliveryStationsApi = defineTemplateApi({
  action: 'getDeliveryStationList',
  externalDataId: 'deliveryStationList',
})

export const PlateTypesApi = defineTemplateApi({
  action: 'getPlateTypeList',
  externalDataId: 'plateTypeList',
})
