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

export const NationalRegistryCustodiansApi = defineTemplateApi({
  // TODO fix action when NationalRegistryV3 is ready
  // also update all usage of type NationalRegistryParent
  action: 'getParents',
  externalDataId: 'nationalRegistryCustodians',
  namespace: 'NationalRegistry',
})

export const UserProfileApiWithValidation = UserProfileApi.configure({
  params: {
    validatePhoneNumberIfNotActor: true,
    validateEmailIfNotActor: true,
  },
})
