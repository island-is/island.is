import {
  ApplicationTypes,
  defineTemplateApi,
  IdentityApi,
} from '@island.is/application/types'
export { NationalRegistryV3UserApi } from '@island.is/application/types'

export const IdentityApiProvider = IdentityApi.configure({
  params: {
    includeActorInfo: true,
  },
})

export const CategoriesApi = defineTemplateApi({
  action: 'getCategories',
  externalDataId: 'categories',
  namespace: ApplicationTypes.CHILD_PROTECTION_NOTIFICATION,
})
