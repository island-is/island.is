import {
  defineTemplateApi,
  InstitutionNationalIds,
  PaymentCatalogApi,
} from '@island.is/application/types'

export { IdentityApi, UserProfileApi } from '@island.is/application/types'

export const VinnueftirlitidPaymentCatalogApi = PaymentCatalogApi.configure({
  params: {
    organizationId: InstitutionNationalIds.VINNUEFTIRLITID,
  },
  externalDataId: 'payment',
})

export const MachinesApi = defineTemplateApi({
  action: 'getMachines',
  externalDataId: 'machinesList',
})
