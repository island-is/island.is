import { defineTemplateApi, UserProfileApi } from '@island.is/application/types'

export { NationalRegistryUserApi } from '@island.is/application/types'

export const ApplicationPeriodApi = defineTemplateApi({
  action: 'getApplicationPeriodInfo',
  externalDataId: 'applicationPeriodInfo',
  namespace: 'SecondarySchool',
})

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
  action: 'getCustodians',
  externalDataId: 'nationalRegistryCustodians',
  namespace: 'NationalRegistry',
})

export const UserProfileApiWithValidation = UserProfileApi.configure({
  params: {
    validatePhoneNumberIfNotActor: true,
    validateEmailIfNotActor: true,
  },
})
