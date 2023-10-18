import {
  defineTemplateApi,
  InstitutionNationalIds,
  PaymentCatalogApi,
} from '@island.is/application/types'

export { IdentityApi, UserProfileApi } from '@island.is/application/types'

export const SamgongustofaPaymentCatalogApi = PaymentCatalogApi.configure({
  params: {
    organizationId: InstitutionNationalIds.SAMGONGUSTOFA,
  },
  externalDataId: 'payment',
})

export const MachinesApi = defineTemplateApi({
  action: 'getMachines',
  externalDataId: 'machinesList',
})

export const MachineDetailApi = defineTemplateApi({
  action: 'getMachineDetail',
  externalDataId: 'machineDetail',
})

export const CurrentVehiclesApi = defineTemplateApi({
  action: 'getCurrentVehiclesWithOwnerchangeChecks',
  externalDataId: 'currentVehicleList',
})

export const InsuranceCompaniesApi = defineTemplateApi({
  action: 'getInsuranceCompanyList',
  externalDataId: 'insuranceCompanyList',
})
