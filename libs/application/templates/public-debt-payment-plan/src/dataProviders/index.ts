import { defineTemplateApi } from '@island.is/application/types'

export {
  NationalRegistryV3UserApi,
  UserProfileApi,
  IdentityApi,
} from '@island.is/application/types'

export const PaymentPlanPrerequisitesApi = defineTemplateApi({
  action: 'paymentPlanPrerequisites',
})
