import {
  ApplicationTypes,
  defineTemplateApi,
} from '@island.is/application/types'

export const GetTypesApi = defineTemplateApi({
  action: 'getTypes',
  externalDataId: 'types',
  namespace: ApplicationTypes.NEW_PRIMARY_SCHOOL,
})

export const GetUserApi = defineTemplateApi({
  action: 'getUserById',
  externalDataId: 'userInfo',
  namespace: ApplicationTypes.NEW_PRIMARY_SCHOOL,
})

export const GetSchoolsApi = defineTemplateApi({
  action: 'getAllSchoolsByMunicipality',
  externalDataId: 'schools',
  namespace: ApplicationTypes.NEW_PRIMARY_SCHOOL,
})

export const OptionsApi = defineTemplateApi({
  action: 'getAllKeyOptions',
  externalDataId: 'KeyOptions',
  namespace: ApplicationTypes.NEW_PRIMARY_SCHOOL,
})
