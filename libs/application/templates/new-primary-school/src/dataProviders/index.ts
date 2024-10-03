import {
  ApplicationTypes,
  defineTemplateApi,
} from '@island.is/application/types'

export const ChildrenApi = defineTemplateApi({
  action: 'getChildren',
  externalDataId: 'children',
  namespace: ApplicationTypes.NEW_PRIMARY_SCHOOL,
})
