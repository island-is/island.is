import {
  ApplicationTypes,
  defineTemplateApi,
} from '@island.is/application/types'

export const GetKeyOptionsTypesApi = defineTemplateApi({
  action: 'getKeyOptionsTypes',
  externalDataId: 'keyOptionsTypes',
  namespace: ApplicationTypes.NEW_PRIMARY_SCHOOL,
})

export const OptionsApi = defineTemplateApi({
  action: 'getAllKeyOptions',
  externalDataId: 'KeyOptions',
  namespace: ApplicationTypes.NEW_PRIMARY_SCHOOL,
})
