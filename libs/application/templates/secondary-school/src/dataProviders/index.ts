import { defineTemplateApi, UserProfileApi } from '@island.is/application/types'

export { NationalRegistryUserApi } from '@island.is/application/types'

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

export const UserProfileApiWithValidation = UserProfileApi.configure({
  params: {
    validatePhoneNumber: true,
    validateEmail: true,
  },
})
