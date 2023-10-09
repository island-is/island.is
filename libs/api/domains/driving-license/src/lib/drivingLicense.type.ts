export interface StudentInformation {
  name: string
}

export interface DrivingLicenseType {
  id: string
  name: string
}

export type DrivingLicenseApplicationType = 'B-full' | 'B-temp'

export interface NewDrivingLicenseInput {
  jurisdictionId: number
  needsToPresentHealthCertificate: boolean
  needsToPresentQualityPhoto: boolean
}

export interface NewTemporaryDrivingLicenseInput {
  jurisdictionId: number
  needsToPresentHealthCertificate: boolean
  needsToPresentQualityPhoto: boolean
  teacherNationalId: string
  email: string
  phone: string
}

export interface NewDrivingLicenseResult {
  success: boolean
  errorMessage: string | null
}

export interface NewDrivingAssessmentResult {
  success: boolean
  errorMessage: string | null
}

export interface TeachingRightsStatus {
  nationalId: string
  hasTeachingRights: boolean
}

export interface StudentQueryInput {
  nationalId: string
}

export interface Jurisdiction {
  id: number
  name: string
  zip: number
}

export enum RequirementKey {
  drivingAssessmentMissing = 'DrivingAssessmentMissing',
  drivingSchoolMissing = 'DrivingSchoolMissing',
  deniedByService = 'DeniedByService',
  localResidency = 'LocalResidency',
  currentLocalResidency = 'CurrentLocalResidency',
  noTempLicense = 'NoTempLicense',
  noLicenseFound = 'NoLicenseFound',
  personNot17YearsOld = 'PersonNot17YearsOld',
  hasNoPhoto = 'HasNoPhoto',
  hasNoSignature = 'HasNoSignature',
  personNotFoundInNationalRegistry = 'PersonNotFoundInNationalRegistry',
  hasDeprivation = 'HasDeprivation',
  hasPoints = 'HasPoints',
  personNotAtLeast24YearsOld = 'PersonNotAtLeast24YearsOld',
  hasHadValidCategoryForFiveYearsOrMore = 'HasHadValidCategoryForFiveYearsOrMore',
}

export interface ApplicationEligibilityRequirement {
  key: RequirementKey
  requirementMet: boolean
}

export interface ApplicationEligibility {
  isEligible: boolean
  requirements: ApplicationEligibilityRequirement[]
}

export enum DrivingLicenseCategory {
  B = 'B',
}

export enum NeedsHealhCertificate {
  TRUE = 1,
  FALSE = 0,
}

export enum NeedsQualityPhoto {
  TRUE = 1,
  FALSE = 0,
}
export interface QualityPhotoResult {
  hasQualityPhoto: boolean
}

export interface QualitySignatureResult {
  hasQualitySignature: boolean
}

export interface StudentAssessment {
  studentNationalId: string | null
  teacherNationalId: string | null
  teacherName: string | null
}

export interface DrivingSchool {
  hasFinishedSchool: boolean
}
