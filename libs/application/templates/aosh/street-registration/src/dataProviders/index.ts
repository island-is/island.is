import {
  InstitutionNationalIds,
  PaymentCatalogApi,
  defineTemplateApi,
} from '@island.is/application/types'

export { IdentityApi, UserProfileApi } from '@island.is/application/types'

export const MachinesApi = defineTemplateApi({
  action: 'getMachines',
  externalDataId: 'machinesList',
})

export const MustInspectBeforeRegistrationApi = defineTemplateApi({
  action: 'getTypesMustInspectBeforeRegistration',
  externalDataId: 'typesMustInspectBeforeRegistration',
})

export const GetAvailableRegistrationTypes = defineTemplateApi({
  action: 'getAvailableRegistrationTypes',
  externalDataId: 'availableRegistrationTypes',
})

export const VinnueftirlitidPaymentCatalogApi = PaymentCatalogApi.configure({
  params: {
    organizationId: InstitutionNationalIds.SAMGONGUSTOFA,
  },
  externalDataId: 'payment',
})
