import {
  defineTemplateApi,
  NationalRegistryUserApi,
} from '@island.is/application/types'

export const NationalRegistryApi = NationalRegistryUserApi.configure({
  order: 1,
})

export const propertiesApi = defineTemplateApi({
  action: 'getProperties',
  order: 2,
})
