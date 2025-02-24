import {
  ApplicationTypes,
  defineTemplateApi,
} from '@island.is/application/types'

export const ChildrenApi = defineTemplateApi({
  action: 'getChildren',
  externalDataId: 'children',
  namespace: ApplicationTypes.PRIMARY_SCHOOL,
})
