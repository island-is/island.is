import { defineTemplateApi } from '@island.is/application/types'

export const CanSignApi = defineTemplateApi({
  action: 'canSign',
  order: 0,
})

export const GetListApi = defineTemplateApi({
  action: 'getList',
  order: 1,
})

export const MunicipalIdentityApi = defineTemplateApi({
  action: 'municipalIdentity',
  order: 2,
})
