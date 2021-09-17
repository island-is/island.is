import type {
  OkukennariDto,
  Okuskirteini,
} from '@island.is/clients/driving-license'

export interface Eligibility {
  id: string
  issued: Date | undefined
  expires: Date | undefined
  comment: string
}

export interface DrivingLicense {
  id: Okuskirteini['id']
  name: string
  issued: Date | undefined
  expires: Date | undefined
  isProvisional: boolean | undefined
  eligibilities: Eligibility[]
}

export interface DeprevationType {
  id: number
  name: string
}

export interface StudentInformation {
  name: string
}

export interface DrivingLicenseType {
  id: string
  name: string
}

export interface RemarkType {
  id: number
  remark: boolean
  for: string
  name: string
  description: string
}

export interface PenaltyPointStatus {
  nationalId: string
  isPenaltyPointsOk: boolean
}

export interface NewDrivingLicenseInput {
  juristictionId: number
  needsToPresentHealthCertificate: boolean
  needsToPresentQualityPhoto: boolean
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

export interface Teacher {
  nationalId: OkukennariDto['kennitala']
  name: OkukennariDto['nafn']
}
