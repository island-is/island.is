import { defineTemplateApi } from '../../TemplateApi'

export interface NationalRegistryParameters {
  ageToValidate?: number
}
export const NationalRegistryUserApi = defineTemplateApi<NationalRegistryParameters>(
  {
    action: 'getUser',
    namespace: 'NationalRegistry',
  },
)

export const NationalRegistryFamilyApi = defineTemplateApi({
  action: 'getFamily',
  namespace: 'NationalRegistry',
})

export const UserProfileApi = defineTemplateApi({
  action: 'getUserProfile',
  namespace: 'UserProfile',
})
