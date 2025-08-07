import { defineTemplateApi } from '../../TemplateApi'

const namespace = 'DrivingLicenseShared'

export const HasTeachingRightsApi = defineTemplateApi({
  action: 'getHasTeachingRights',
  namespace,
})

export const GetTeacherRightsApi = defineTemplateApi({
  action: 'getTeacherRights',
  namespace,
})

export const TeachersApi = defineTemplateApi({
  action: 'teachers',
  namespace,
})

export interface CurrentLicenseParameters {
  validCategories?: string[]
  useLegacyVersion: boolean
}

export const CurrentLicenseApi = defineTemplateApi<CurrentLicenseParameters>({
  action: 'currentLicense',
  namespace,
})

export const QualityPhotoApi = defineTemplateApi({
  action: 'qualityPhoto',
  namespace,
})

export const QualitySignatureApi = defineTemplateApi({
  action: 'qualitySignature',
  namespace,
})

export const AllPhotosFromThjodskraApi = defineTemplateApi({
  action: 'allPhotosFromThjodskra',
  namespace,
})

export const DrivingAssessmentApi = defineTemplateApi({
  action: 'drivingAssessment',
  namespace,
})

export const JurisdictionApi = defineTemplateApi({
  action: 'jurisdictions',
  namespace,
})

export const EmployeeApi = defineTemplateApi({
  action: 'drivingSchoolForEmployee',
  namespace,
})
