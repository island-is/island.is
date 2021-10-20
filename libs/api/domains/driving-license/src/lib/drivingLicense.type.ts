export interface StudentInformation {
  name: string
}

export interface DrivingLicenseType {
  id: string
  name: string
}

export type DrivingLicenseApplicationType = 'B-full' | 'B-temp'

export interface NewDrivingLicenseInput {
  juristictionId: number
  needsToPresentHealthCertificate: boolean
  needsToPresentQualityPhoto: boolean
}

export interface NewTemporaryDrivingLicenseInput {
  juristictionId: number
  needsToPresentHealthCertificate: boolean
  needsToPresentQualityPhoto: boolean
  teacherNationalId: string
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

export interface Juristiction {
  id: number
  name: string
  zip: number
}

export enum RequirementKey {
  drivingAssessmentMissing = 'DrivingAssessmentMissing',
  drivingSchoolMissing = 'DrivingSchoolMissing',
  deniedByService = 'DeniedByService',
  localResidency = 'LocalResidency',
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
  success: boolean
  qualityPhoto: string | null
  errorMessage: string | null
}

export interface StudentAssessment {
  studentNationalId: string | null
  teacherNationalId: string | null
  teacherName: string | null
}

export interface DrivingSchool {
  hasFinishedSchool: boolean
}
