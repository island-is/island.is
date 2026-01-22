import {
  defineTemplateApi,
  NationalRegistryV3UserApi,
} from '@island.is/application/types'

export { IdentityApi } from '@island.is/application/types'

export const NationalRegistryApi = NationalRegistryV3UserApi.configure({
  order: 1,
})

export const propertiesApi = defineTemplateApi({
  action: 'getProperties',
  order: 2,
})
