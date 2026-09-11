import { getValueViaPath, NO, YES } from '@island.is/application/core'
import { ExternalData } from '@island.is/application/types'
import { DrivingLicense } from '../types'
import {
  B_FULL,
  B_FULL_RENEWAL_65,
  B_TEMP,
  codesExtendedLicenseCategories,
  DrivingLicenseApplicationFor,
  DrivingLicenseFakeData,
  remarksCannotRenew65,
  RequirementKey,
  TEMPORARY_LICENSE_VALID_CODE,
} from './constants'
import { hasUsableRlsQualityPhoto } from './formUtils'

// External-data key the `checkEligibility` provider writes its per-type result
// under. The eligibility summary reads it back through `getStoredTypeEligibility`.
export const ELIGIBILITY_EXTERNAL_DATA_ID = 'eligibility'

// One requirement row, as stored in external data and consumed by
// `extractReasons`. The key mirrors RLS's `ApplicationEligibilityRequirement.key`.
export interface EligibilityRequirementRow {
  key: RequirementKey
  requirementMet: boolean
  daysOfResidency?: number | null
  messageIs?: string | null
  messageEn?: string | null
}

export interface TypeEligibility {
  isEligible: boolean
  requirements: EligibilityRequirementRow[]
}

export type EligibilityByType = Partial<
  Record<DrivingLicenseApplicationFor, TypeEligibility>
>

export interface StoredEligibility {
  byType: EligibilityByType
}

// A usable photo can come from the RLS quality photo or a Þjóðskrá facial photo.
// This is a universal requirement (every type needs one), so it is enforced on
// the external-data screen rather than per type on the summary.
export const hasUsablePhoto = (externalData: ExternalData): boolean => {
  if (hasUsableRlsQualityPhoto(externalData)) return true

  const images =
    getValueViaPath<{ images?: Array<{ contentSpecification?: string }> }>(
      externalData,
      'allPhotosFromThjodskra.data',
    )?.images ?? []

  return images.some((p) => p.contentSpecification === 'FACIAL')
}

// 65+ cannot renew while holding an extended category (C/CE/D/…) issued on a
// different date than the B category.
export const hasExtendedDrivingLicense = (
  currentLicense: DrivingLicense | undefined,
): boolean => {
  const drivingLicenseIssued = currentLicense?.categories?.find(
    (c) => c.nr === 'B',
  )?.issued
  if (!drivingLicenseIssued) return false

  const relevant = currentLicense?.categories?.filter((c) =>
    codesExtendedLicenseCategories.includes(c.nr),
  )
  if (!relevant?.length) return false

  return relevant.some((c) => c.issued !== drivingLicenseIssued)
}

// 65+ cannot renew with a blocking remark (400 / 450 / 95).
export const hasBlockingRenewal65Remarks = (
  currentLicense: DrivingLicense | undefined,
): boolean =>
  currentLicense?.remarks?.some((r) => remarksCannotRenew65.includes(r.code)) ??
  false

// The applicant's age, from fakeData when faking, else the national registry.
const getApplicantAge = (
  externalData: ExternalData,
  fakeData?: DrivingLicenseFakeData,
): number => {
  const raw =
    fakeData?.useFakeData === YES
      ? fakeData.age
      : getValueViaPath<number>(externalData, 'nationalRegistry.data.age')
  return Number(raw) || 0
}

// The applicant's B category, if any. The fake-data provider bakes the faked
// license (including its validToCode) into `currentLicense.data`, so this reads
// external data uniformly for both real and fake paths. Reads `nr` or `name`
// because legacy RLS records carry the category letter in `name` with an empty
// `nr`.
const getBCategory = (externalData: ExternalData) =>
  getValueViaPath<
    Array<{ nr?: string | null; name?: string | null; validToCode?: number }>
  >(externalData, 'currentLicense.data.categories', [])?.find(
    (c) => (c.nr || c.name)?.toUpperCase() === 'B',
  )

// Which types are structurally possible from the license and age alone, before
// the RLS can-apply check:
//   - B-temp:      holds no B license (a new applicant / learner)
//   - B-full:      holds a temporary B — the upgrade to a full license
//   - renewal-65:  holds a full B and is 65+
// Someone who already holds a full B (and isn't 65+) is a candidate for nothing
// here, so no type is offered and the provider blocks with "nothing to apply for".
export const structuralCandidates = (
  externalData: ExternalData,
  fakeData?: DrivingLicenseFakeData,
): DrivingLicenseApplicationFor[] => {
  const bCategory = getBCategory(externalData)
  const holdsTempB = bCategory?.validToCode === TEMPORARY_LICENSE_VALID_CODE
  const holdsFullB = !!bCategory && !holdsTempB
  const age = getApplicantAge(externalData, fakeData)

  const candidates: DrivingLicenseApplicationFor[] = []
  if (!bCategory) candidates.push(B_TEMP)
  if (holdsTempB) candidates.push(B_FULL)
  if (holdsFullB && age >= 65) candidates.push(B_FULL_RENEWAL_65)
  return candidates
}

// Assemble one type's requirement list for the eligibility summary from the RLS
// `getApplicationEligibility` result. B-temp / B-full show exactly what RLS
// returns (driving school, assessment, residency, can-apply); 65+ adds the
// extended-category / remark checks derived from the current license. The
// quality photo is intentionally NOT included — it is a universal requirement
// enforced on the external-data screen, so by the time the summary renders it is
// already satisfied.
export const buildTypeEligibility = (
  type: DrivingLicenseApplicationFor,
  serverResult: TypeEligibility,
  externalData: ExternalData,
): TypeEligibility => {
  if (type !== B_FULL_RENEWAL_65) return serverResult

  const currentLicense = getValueViaPath<DrivingLicense>(
    externalData,
    'currentLicense.data',
  )
  const extended = hasExtendedDrivingLicense(currentLicense)
  const remarks = hasBlockingRenewal65Remarks(currentLicense)

  // A blocking remark makes the applicant ineligible but is not surfaced as its
  // own requirement row (matching the original application's behavior).
  return {
    isEligible: serverResult.isEligible && !extended && !remarks,
    requirements: [
      ...serverResult.requirements,
      ...(extended
        ? [
            {
              key: RequirementKey.noExtendedDrivingLicense,
              requirementMet: false,
            },
          ]
        : []),
    ],
  }
}

// The fake-data equivalent: mirrors the requirement rows RLS would return for a
// type, driven by the dev fake-data answers, so the summary can be exercised
// without calling RLS. Residency days come from the fake-data field; the RLS
// can-apply and (for B-full) assessment/school are assumed met. For renewal-65
// the extended-license block is driven by the `hasExtendedLicense` fake toggle
// (the shared fake-license builder can't reproduce the differing issued dates
// the real check reads), and the blocking-remark block by the
// `hasRenewalBlockingRemark` fake toggle.
export const fakeTypeEligibility = (
  type: DrivingLicenseApplicationFor,
  fakeData?: DrivingLicenseFakeData,
): TypeEligibility => {
  const days = Number(fakeData?.howManyDaysHaveYouLivedInIceland) || 0
  const requirements: EligibilityRequirementRow[] = []

  if (type === B_FULL) {
    requirements.push(
      {
        key: RequirementKey.drivingAssessmentMissing,
        requirementMet: fakeData?.hasDrivingAssessment !== NO,
      },
      {
        key: RequirementKey.drivingSchoolMissing,
        requirementMet: fakeData?.hasFinishedDrivingSchool !== NO,
      },
      {
        key: RequirementKey.currentLocalResidency,
        requirementMet: days >= 185,
        daysOfResidency: days,
      },
    )
  } else if (type === B_TEMP) {
    requirements.push({
      key: RequirementKey.localResidency,
      requirementMet: days >= 185,
      daysOfResidency: days,
    })
  }

  // RLS can-apply (fake path). Only the B-temp minimum age (17) is modeled here;
  // other RLS reasons (points, deprivation) are assumed to pass. On the real path
  // this comes back from RLS as a PERSON_NOT_17_YEARS_OLD denial.
  const age = Number(fakeData?.age) || 0
  requirements.push(
    type === B_TEMP && age < 17
      ? { key: RequirementKey.personNot17YearsOld, requirementMet: false }
      : { key: RequirementKey.deniedByService, requirementMet: true },
  )

  if (type === B_FULL_RENEWAL_65) {
    const extended = fakeData?.hasExtendedLicense === YES
    const remarks = fakeData?.hasRenewalBlockingRemark === YES
    if (extended) {
      requirements.push({
        key: RequirementKey.noExtendedDrivingLicense,
        requirementMet: false,
      })
    }
    // A blocking remark makes the applicant ineligible but is not surfaced as
    // its own requirement row (matching the original application's behavior).
    return {
      isEligible:
        requirements.every((r) => r.requirementMet) && !extended && !remarks,
      requirements,
    }
  }

  return {
    isEligible: requirements.every((r) => r.requirementMet),
    requirements,
  }
}

// Read the stored per-type eligibility for one type. Used by the eligibility
// summary to render the requirement rows and to set its `requirementsMet` gate.
export const getStoredTypeEligibility = (
  externalData: ExternalData,
  type: DrivingLicenseApplicationFor,
): TypeEligibility | undefined =>
  getValueViaPath<StoredEligibility>(
    externalData,
    `${ELIGIBILITY_EXTERNAL_DATA_ID}.data`,
  )?.byType?.[type]
