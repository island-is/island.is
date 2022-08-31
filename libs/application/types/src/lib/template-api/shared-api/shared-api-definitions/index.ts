import { defineTemplateApi } from '../../TemplateApi'

export const NationalRegistryUserApi = defineTemplateApi({
  action: 'getUser',
  namespace: 'NationalRegistry',
})

export const NationalRegistryFamilyApi = defineTemplateApi({
  action: 'getFamily',
  namespace: 'NationalRegistry',
})

export const UserProfileApi = defineTemplateApi({
  action: 'getUserProfile',
  namespace: 'UserProfile',
})
