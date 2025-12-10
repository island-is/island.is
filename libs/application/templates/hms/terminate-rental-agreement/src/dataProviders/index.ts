import {
  defineTemplateApi,
  NationalRegistryUserApi,
} from '@island.is/application/types'

export const NationalRegistryApi = NationalRegistryUserApi.configure({
  order: 1,
})

export const rentalAgreementsApi = defineTemplateApi({
  action: 'getRentalAgreements',
  order: 2,
})
