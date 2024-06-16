import {
  ApplicationTypes,
  defineTemplateApi,
} from '@island.is/application/types'

export const GetTypesApi = defineTemplateApi({
  action: 'getTypes',
  externalDataId: 'types',
  namespace: ApplicationTypes.NEW_PRIMARY_SCHOOL,
})

export const GetHealthApi = defineTemplateApi({
  action: 'getHealth',
  externalDataId: 'health',
  namespace: ApplicationTypes.NEW_PRIMARY_SCHOOL,
})
