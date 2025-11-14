import {
  defineTemplateApi,
  NationalRegistryV3UserApi,
} from '@island.is/application/types'

export const NationalRegistryApi = NationalRegistryV3UserApi.configure({
  order: 1,
})

export const rentalAgreementsApi = defineTemplateApi({
  action: 'getRentalAgreements',
  order: 2,
})
