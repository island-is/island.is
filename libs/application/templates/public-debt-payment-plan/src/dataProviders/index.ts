import { defineTemplateApi } from '@island.is/application/types'

export {
  NationalRegistryUserApi,
  UserProfileApi,
  IdentityApi,
} from '@island.is/application/types'

export const PaymentPlanPrerequisitesApi = defineTemplateApi({
  action: 'paymentPlanPrerequisites',
})
