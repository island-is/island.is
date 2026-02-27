export interface StudentInformation {
  name: string
}

export interface DrivingLicenseType {
  id: string
  name: string
}

export type DrivingLicenseApplicationType = 'B-full' | 'B-temp' | 'BE'

export interface PostRenewal65AndOverInput {
  districtId?: number
  pickupPlasticAtDistrict?: boolean | null
  sendPlasticToPerson?: boolean | null
  healtCertificate?: string | null
}

export enum Pickup {
  'POST' = 'post',
  'DISTRICT' = 'district',
}

export interface NewDrivingLicenseInput {
  jurisdictionId: number
  needsToPresentHealthCertificate: boolean
  needsToPresentQualityPhoto: boolean
  licenseCategory: DrivingLicenseCategory
  sendLicenseInMail: number
}

export interface NewTemporaryDrivingLicenseInput {
  jurisdictionId: number
  needsToPresentHealthCertificate: boolean
  needsToPresentQualityPhoto: boolean
  teacherNationalId: string
  email: string
  phone: string
  sendLicenseInMail: boolean
}

export interface NewBEDrivingLicenseContentItem {
  fileName?: string | null
  fileExtension?: string | null
  contentType?: string | null
  content?: string | null
  description?: string | null
}

export interface NewBEDrivingLicenseInput {
  jurisdiction: number
  instructorSSN: string
  primaryPhoneNumber: string
  studentEmail: string
  contentList?: NewBEDrivingLicenseContentItem[] | null
  photoBiometricsId?: string | null
  signatureBiometricsId?: string | null
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

export interface DrivinglicenseDuplicateValidityStatus {
  canGetNewDuplicate: boolean
  meta: string
}

export interface StudentQueryInput {
  nationalId: string
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
  noExtendedDrivingLicense = 'NoExtendedDrivingLicense',
}

export interface ApplicationEligibilityRequirement {
  key: RequirementKey
  requirementMet: boolean
  daysOfResidency?: number
}

export interface ApplicationEligibility {
  isEligible: boolean
  requirements: ApplicationEligibilityRequirement[]
}

export enum DrivingLicenseCategory {
  B = 'B',
  BE = 'BE',
}

export enum NeedsHealthCertificate {
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
