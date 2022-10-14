import { defineTemplateApi } from '../../TemplateApi'

const namespace = 'DrivingLicenseShared'

export const HasTeachingRightsApi = defineTemplateApi({
  action: 'getHasTeachingRights',
  namespace,
})

export const TeachersApi = defineTemplateApi({
  action: 'teachers',
  namespace,
})

export const CurrentLicenseApi = defineTemplateApi({
  action: 'currentLicense',
  namespace,
})

export const QualityPhotoApi = defineTemplateApi({
  action: 'qualityPhoto',
  namespace,
})

export const DrivingAssessmentApi = defineTemplateApi({
  action: 'drivingAssessment',
  namespace,
})

export const JuristictionApi = defineTemplateApi({
  action: 'juristictions',
  namespace,
})

export const EmployeeApi = defineTemplateApi({
  action: 'drivingSchoolForEmployee',
  namespace,
})
