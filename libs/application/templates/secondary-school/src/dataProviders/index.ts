import { defineTemplateApi } from '@island.is/application/types'

export {
  NationalRegistryUserApi,
  UserProfileApi,
} from '@island.is/application/types'

export const StudentInfoApi = defineTemplateApi({
  action: 'getStudentInfo',
  externalDataId: 'studentInfo',
  namespace: 'SecondarySchool',
})

export const SchoolsApi = defineTemplateApi({
  action: 'getSchools',
  externalDataId: 'schools',
  namespace: 'SecondarySchool',
})

export const NationalRegistryParentsApi = defineTemplateApi({
  action: 'getParents',
  externalDataId: 'nationalRegistryParents',
  namespace: 'NationalRegistry',
})
