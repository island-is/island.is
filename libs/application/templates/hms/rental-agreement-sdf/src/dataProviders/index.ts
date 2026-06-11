import { defineTemplateApi } from '@island.is/application/types'

export const SearchAddressesApi = defineTemplateApi({
  action: 'searchAddresses',
  order: 1,
})

export const GetPropertyInfoApi = defineTemplateApi({
  action: 'getPropertyInfo',
  order: 2,
})
