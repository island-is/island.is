import {
  ApplicationTypes,
  defineTemplateApi,
} from '@island.is/application/types'

export const GetTypesApi = defineTemplateApi({
  action: 'getTypesX',
  externalDataId: 'typesX',
  namespace: ApplicationTypes.NEW_PRIMARY_SCHOOL,
})
