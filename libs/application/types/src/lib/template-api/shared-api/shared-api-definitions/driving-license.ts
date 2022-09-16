import { defineTemplateApi } from '../../TemplateApi'

export const HasTechingRightsApi = defineTemplateApi({
  action: 'getHasTeachingRights',
  namespace: 'DrivingLicense',
  externalDataId: 'teachingRights',
})
