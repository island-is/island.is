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

export const QualityPhotoAndSignatureApi = defineTemplateApi({
  action: 'qualityPhotoAndSignature',
  namespace,
})

export interface PhotoLookupCheckParameters {
  // Which external data entry holds the template's license registry photo
  rlsPhotoSource: 'qualityPhoto' | 'qualityPhotoAndSignature'
}

// Runs after the photo providers (order 0) and fails the data step when a
// photo lookup errored and no other source returned a photo. Without it a
// failed lookup reads as "no photo" and the applicant is sent to the office.
export const PhotoLookupCheckApi =
  defineTemplateApi<PhotoLookupCheckParameters>({
    action: 'photoLookupCheck',
    namespace,
    order: 1,
    shouldPersistToExternalData: false,
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
