import { defineTemplateApi } from '@island.is/application/types'

export {
  UserProfileApi,
  NationalRegistryUserApi,
} from '@island.is/application/types'

export const UniversityApi = defineTemplateApi({
  action: 'getUniversities',
  externalDataId: 'universities',
  namespace: 'University',
})

export const ProgramApi = defineTemplateApi({
  action: 'getPrograms',
  externalDataId: 'programs',
  namespace: 'University',
})

export const InnaApi = defineTemplateApi({
  action: 'getInnaDiplomas',
  externalDataId: 'innaEducation',
  namespace: 'EducationShared',
  params: {
    allowEmpty: true,
  },
})
