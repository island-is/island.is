import { defineTemplateApi } from '@island.is/application/types'

export const CanSignApi = defineTemplateApi({
  action: 'canSign',
  order: 0,
})

export const GetListApi = defineTemplateApi({
  action: 'getList',
  order: 1,
})
