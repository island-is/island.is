import { YesOrNo } from '@island.is/application/core'
import { DefaultEvents } from '@island.is/application/types'

export enum ApiActions {
  submitApplication = 'submitApplication',
  createCharge = 'createCharge',
}

export const B_FULL = 'B-full'
export const B_TEMP = 'B-temp'
export const B_FULL_RENEWAL_65 = 'B-full-renewal-65'
export const DELIVERY_FEE = 'deliveryFee'

export enum Pickup {
  'POST' = 'post',
  'DISTRICT' = 'district',
}

export const CHARGE_ITEM_CODES: Record<string, string> = {
  [B_TEMP]: 'AY114',
  [B_FULL]: 'AY110',
  [B_FULL_RENEWAL_65]: 'AY113',
  [DELIVERY_FEE]: 'AY145',
}

export const otherLicenseCategories = ['C', 'C1', 'CE', 'D', 'D1', 'DE']
// Remark codes that trigger the health-certificate upload. Mirrors EU
// Directive 2006/126/EC Annex I §5 (vision / hearing / prosthesis), per
// Samgöngustofa regulation. Administrative codes (e.g. `71` samrit) must
// not be in this list.
export const codesRequiringHealthCertificate = [
  '01',
  '01.01',
  '01.02',
  '01.05',
  '01.06',
  '01.07',
  '02',
  '03',
  '03.01',
  '03.02',
]
export const codesExtendedLicenseCategories = [
  'C1',
  'C1E',
  'C',
  'CE',
  'D1',
  'D1E',
  'D',
  'DE',
  'Bfar',
  'Far',
  'FAR',
]
export const remarksCannotRenew65 = ['400', '450', '95']

// RLS models a temporary (bráðabirgða) B license as category B with validToCode
// 8, and a full B license with validToCode 9. Used to tell an upgrade applicant
// (temporary B → full B) apart from someone who already holds a full B.
export const TEMPORARY_LICENSE_VALID_CODE = 8

// Local mirror of `@island.is/api/schema`'s `RequirementKey` (RLS's
// `ApplicationEligibilityRequirement.key`). Kept in-template so the eligibility
// logic below stays out of the `@island.is/api/schema` dependency: `index.ts`
// eagerly re-exports `eligibility.ts` and the shared driving-license submission
// service imports it, so it is part of the backend/OpenAPI build graph — which
// generates `@island.is/api/schema` itself and so cannot import from it. String
// values are identical to the generated enum, so stored external-data rows and
// downstream comparisons are unchanged.
export enum RequirementKey {
  currentLocalResidency = 'currentLocalResidency',
  deniedByService = 'deniedByService',
  drivingAssessmentMissing = 'drivingAssessmentMissing',
  drivingSchoolMissing = 'drivingSchoolMissing',
  hasDeprivation = 'hasDeprivation',
  hasHadValidCategoryForFiveYearsOrMore = 'hasHadValidCategoryForFiveYearsOrMore',
  hasNoPhoto = 'hasNoPhoto',
  hasNoSignature = 'hasNoSignature',
  hasPoints = 'hasPoints',
  localResidency = 'localResidency',
  noExtendedDrivingLicense = 'noExtendedDrivingLicense',
  noLicenseFound = 'noLicenseFound',
  noTempLicense = 'noTempLicense',
  personNot17YearsOld = 'personNot17YearsOld',
  personNotAtLeast24YearsOld = 'personNotAtLeast24YearsOld',
  personNotFoundInNationalRegistry = 'personNotFoundInNationalRegistry',
}

export type DrivingLicenseApplicationFor =
  | typeof B_FULL
  | typeof B_TEMP
  | typeof B_FULL_RENEWAL_65

export type Events =
  | { type: DefaultEvents.SUBMIT }
  | { type: DefaultEvents.PAYMENT }
  | { type: DefaultEvents.APPROVE }
  | { type: DefaultEvents.REJECT }
  | { type: DefaultEvents.ABORT }

export enum Roles {
  APPLICANT = 'applicant',
}

export enum States {
  DRAFT = 'draft',
  DONE = 'done',
  PAYMENT = 'payment',
  DECLINED = 'declined',
  PREREQUISITES = 'prerequisites',
}

// These values must match what the shared `buildFakeCurrentLicense` understands:
// 'temp' → category B validToCode 8 (temporary), 'B' → category B validToCode 9
// (full), 'BE' → full B + BE, anything else → no license.
type FakeCurrentLicense = 'none' | 'temp' | 'B' | 'BE'

// Fake-photo modes for hasThjodskraPhoto / hasRLSPhoto:
//   'yes'           — inject a fake photo
//   'no'            — inject "no photo" (fake empty)
//   'real'          — fall through to real RLS / Þjóðskrá data (default)
//   'metadata-only' — inject the prod-observed legacy-record shape:
//                     metadata returned, photo binary missing (RLS only)
export type FakePhotoMode = 'yes' | 'no' | 'real' | 'metadata-only'

export interface DrivingLicenseFakeData {
  useFakeData?: YesOrNo
  currentLicense?: FakeCurrentLicense
  remarks?: YesOrNo
  howManyDaysHaveYouLivedInIceland: string | number
  age: number
  hasThjodskraPhoto?: FakePhotoMode
  hasRLSPhoto?: FakePhotoMode
  // Dev-only: simulate a 65+ applicant who also holds an extended (additional)
  // license (C/CE/D/…). The shared fake-license builder gives every category the
  // same issued date, so it can't reproduce the "issued at a different time"
  // rule the real check uses — this toggle drives the renewal-65 extended-license
  // block on the eligibility summary directly instead.
  hasExtendedLicense?: YesOrNo
  // Dev-only: simulate a 65+ applicant whose license carries a remark that blocks
  // renewal (400 / 450 / 95). The generic `remarks` toggle above injects a
  // non-blocking remark (0.3), so this drives the renewal-65 remark block.
  hasRenewalBlockingRemark?: YesOrNo
  // Dev-only: B-full requirements. Default to met (met unless explicitly 'no'),
  // so an existing fake setup stays eligible. Residency is driven by
  // `howManyDaysHaveYouLivedInIceland` (< 185 → unmet), so it has no toggle.
  hasDrivingAssessment?: YesOrNo
  hasFinishedDrivingSchool?: YesOrNo
}
