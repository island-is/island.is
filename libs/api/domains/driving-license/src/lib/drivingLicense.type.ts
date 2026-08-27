export interface StudentInformation {
  name: string
}

export interface DrivingLicenseType {
  id: string
  name: string
}

export type DrivingLicenseApplicationType = 'B-full' | 'B-temp' | 'BE'

export interface NewRenewal65DrivingLicenseInput {
  jurisdiction: number
  primaryPhoneNumber: string
  studentEmail: string
  pickupPlasticAtDistrict?: boolean
  sendPlasticToPerson?: boolean
  contentList?: NewBEDrivingLicenseContentItem[]
  photoBiometricsId?: string | null
  signatureBiometricsId?: string | null
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
  // Biometric photo/signature references from Þjóðskrá temporary storage,
  // used by the redesigned B-full photo selector. Omitted when the redesign
  // flag is off, keeping the RLS request byte-identical to the legacy flow.
  photoBiometricsId?: string | null
  signatureBiometricsId?: string | null
}

export interface NewTemporaryDrivingLicenseInput {
  jurisdictionId: number
  needsToPresentHealthCertificate: boolean
  needsToPresentQualityPhoto: boolean
  teacherNationalId: string
  email: string
  phone: string
  sendLicenseInMail: boolean
  photoBiometricsId?: string | null
  signatureBiometricsId?: string | null
}

export interface NewBEDrivingLicenseContentItem {
  fileName: string
  fileExtension: string
  contentType: string
  content: string
  description: string
}

export interface NewBEHealthDeclaration {
  isDisabled: boolean
  hasDiabetes: boolean
  hasEpilepsy: boolean
  isAlcoholic: boolean
  hasHeartDisease: boolean
  hasMentalIllness: boolean
  hasOtherDiseases: boolean
  usesMedicalDrugs: boolean
  usesContactGlasses: boolean
  hasReducedPeripheralVision: boolean
}

export interface NewBEDrivingLicenseInput {
  jurisdiction: number
  instructorSSN: string
  primaryPhoneNumber: string
  studentEmail: string
  contentList?: NewBEDrivingLicenseContentItem[]
  photoBiometricsId?: string | null
  signatureBiometricsId?: string | null
  sendPlasticToPerson?: boolean
  healthDeclarationModel: NewBEHealthDeclaration
}

/**
 * Input for the v6 `withhealthdeclaration` endpoints, which carry the health
 * declaration AND the certificate in one call. Reuses the `NewBE*` types rather
 * than renaming them: they are already product-neutral in practice — see
 * `NewRenewal65DrivingLicenseInput.contentList` — and renaming would churn the
 * live BE path for no behavioural gain.
 *
 * Note what the v6 models drop relative to the legacy inputs:
 * `sendLicenseInMail` (0/1) and `sendToAddress` become the single boolean
 * `sendPlasticToPerson`; `needsToPresentHealthCertificate` and
 * `needsToPresentQualityPhoto` are gone, because the certificate travels as
 * `contentList` and the photo as `photoBiometricsId`.
 */
export interface NewDrivingLicenseWithHealthDeclarationInput {
  licenseCategory: string
  districtId: number
  sendPlasticToPerson: boolean
  email?: string
  primaryPhoneNumber?: string
  healthDeclaration: NewBEHealthDeclaration
  contentList?: NewBEDrivingLicenseContentItem[]
  photoBiometricsId?: string | null
  signatureBiometricsId?: string | null
}

export interface NewTemporaryDrivingLicenseWithHealthDeclarationInput
  extends Omit<NewDrivingLicenseWithHealthDeclarationInput, 'licenseCategory'> {
  instructorSSN: string
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
  // Raw RLS error code (when the unmet requirement came from a can-apply denial)
  errorCode?: string
  // RLS's own human-readable description for that code, both languages; the
  // frontend renders the one matching the current locale.
  messageIs?: string
  messageEn?: string
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
