import {
  defineTemplateApi,
  NationalRegistryV3UserApi,
} from '@island.is/application/types'
import { nationalIdPreface } from '../utils/assigneeUtils'

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

// Assignee dataproviders with dynamic ids
export const AssigneeNationalRegistryApi = defineTemplateApi({
  action: 'assigneeNationalRegistry',
  externalDataId: (application, user) =>
    nationalIdPreface(application, user, 'assigneeNationalRegistry'),
})

export const AssigneeUserProfileApi = defineTemplateApi({
  action: 'userProfile',
  externalDataId: (application, user) =>
    nationalIdPreface(application, user, 'assigneeUserProfile'),
  namespace: 'UserProfile',
})

export const AssigneePersonalTaxReturnApi = defineTemplateApi({
  action: 'getAssigneePersonalTaxReturn',
  externalDataId: (application, user) =>
    nationalIdPreface(application, user, 'assigneeTaxReturn'),
})
