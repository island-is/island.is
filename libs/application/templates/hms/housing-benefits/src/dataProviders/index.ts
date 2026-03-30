import {
  defineTemplateApi,
  NationalRegistryV3UserApi,
} from '@island.is/application/types'

export { IdentityApi } from '@island.is/application/types'

export const NationalRegistryApi = NationalRegistryV3UserApi.configure({
  order: 1,
})

export const RentalAgreementsApi = defineTemplateApi({
  action: 'getRentalAgreements',
  order: 2,
})

export const HouseholdMembersApi = defineTemplateApi({
  action: 'getHouseholdMembers',
  order: 3,
})

export const PersonalTaxReturnApi = defineTemplateApi({
  action: 'getPersonalTaxReturn',
  order: 4,
})
