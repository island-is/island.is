import { defineTemplateApi } from '@island.is/application/types'

export { UserProfileApi } from '@island.is/application/types'

export const NationalRegistryIndividualApi = defineTemplateApi({
  action: 'nationalRegistry',
  externalDataId: 'individual',
  namespace: 'NationalRegistry',
})

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
