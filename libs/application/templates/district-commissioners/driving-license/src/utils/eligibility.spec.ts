import { ExternalData } from '@island.is/application/types'
import { NO, YES } from '@island.is/application/core'
import {
  buildTypeEligibility,
  fakeTypeEligibility,
  structuralCandidates,
  TypeEligibility,
} from './eligibility'
import {
  B_FULL,
  B_FULL_RENEWAL_65,
  B_TEMP,
  DrivingLicenseFakeData,
  RequirementKey,
} from './constants'

// Minimal external-data shapes the eligibility helpers read via getValueViaPath.
const externalDataWith = (
  categories: Array<{
    nr?: string
    name?: string
    validToCode?: number
    issued?: string
  }>,
  age = 30,
  remarks: Array<{ code: string }> = [],
): ExternalData =>
  ({
    currentLicense: { data: { categories, remarks }, status: 'success' },
    nationalRegistry: { data: { age }, status: 'success' },
  } as unknown as ExternalData)

describe('structuralCandidates', () => {
  it('offers B-temp when the applicant holds no B category', () => {
    expect(structuralCandidates(externalDataWith([]))).toEqual([B_TEMP])
  })

  it('offers B-full (upgrade) when the applicant holds a temporary B (validToCode 8)', () => {
    expect(
      structuralCandidates(externalDataWith([{ nr: 'B', validToCode: 8 }])),
    ).toEqual([B_FULL])
  })

  it('offers renewal-65 when the applicant holds a full B and is 65+', () => {
    expect(
      structuralCandidates(externalDataWith([{ nr: 'B', validToCode: 9 }], 70)),
    ).toEqual([B_FULL_RENEWAL_65])
  })

  it('offers nothing to a full-B holder under 65', () => {
    expect(
      structuralCandidates(externalDataWith([{ nr: 'B', validToCode: 9 }], 40)),
    ).toEqual([])
  })

  it('reads the B category from `name` when `nr` is empty (legacy records)', () => {
    expect(
      structuralCandidates(externalDataWith([{ name: 'B', validToCode: 8 }])),
    ).toEqual([B_FULL])
  })

  it('uses the faked age over the national registry when faking', () => {
    const fakeData = {
      useFakeData: YES,
      age: 70,
    } as unknown as DrivingLicenseFakeData
    expect(
      structuralCandidates(
        externalDataWith([{ nr: 'B', validToCode: 9 }], 30),
        fakeData,
      ),
    ).toEqual([B_FULL_RENEWAL_65])
  })
})

describe('buildTypeEligibility', () => {
  const served: TypeEligibility = {
    isEligible: true,
    requirements: [
      { key: RequirementKey.deniedByService, requirementMet: true },
    ],
  }

  it('returns the server result unchanged for non-65 types', () => {
    expect(buildTypeEligibility(B_TEMP, served, externalDataWith([]))).toBe(
      served,
    )
  })

  it('blocks renewal-65 with an extended category issued on a different date', () => {
    const externalData = externalDataWith([
      { nr: 'B', issued: '2000-01-01' },
      { nr: 'C', issued: '2010-01-01' },
    ])
    const result = buildTypeEligibility(B_FULL_RENEWAL_65, served, externalData)

    expect(result.isEligible).toBe(false)
    expect(result.requirements).toContainEqual({
      key: RequirementKey.noExtendedDrivingLicense,
      requirementMet: false,
    })
  })

  it('blocks renewal-65 on a blocking remark without adding a requirement row', () => {
    const externalData = externalDataWith([{ nr: 'B', issued: '2000-01-01' }], 70, [
      { code: '400' },
    ])
    const result = buildTypeEligibility(B_FULL_RENEWAL_65, served, externalData)

    expect(result.isEligible).toBe(false)
    expect(
      result.requirements.some(
        (r) => r.key === RequirementKey.noExtendedDrivingLicense,
      ),
    ).toBe(false)
  })

  it('keeps renewal-65 eligible with a single-date B and no blocking remark', () => {
    const externalData = externalDataWith([{ nr: 'B', issued: '2000-01-01' }])
    expect(
      buildTypeEligibility(B_FULL_RENEWAL_65, served, externalData).isEligible,
    ).toBe(true)
  })
})

describe('fakeTypeEligibility', () => {
  it('is eligible for B-temp with enough residency and age >= 17', () => {
    const result = fakeTypeEligibility(B_TEMP, {
      howManyDaysHaveYouLivedInIceland: 365,
      age: 20,
    } as unknown as DrivingLicenseFakeData)

    expect(result.isEligible).toBe(true)
  })

  it('blocks B-temp under 17 with a personNot17 requirement', () => {
    const result = fakeTypeEligibility(B_TEMP, {
      howManyDaysHaveYouLivedInIceland: 365,
      age: 16,
    } as unknown as DrivingLicenseFakeData)

    expect(result.isEligible).toBe(false)
    expect(result.requirements).toContainEqual({
      key: RequirementKey.personNot17YearsOld,
      requirementMet: false,
    })
  })

  it('reports unmet residency for B-temp below 185 days', () => {
    const result = fakeTypeEligibility(B_TEMP, {
      howManyDaysHaveYouLivedInIceland: 100,
      age: 20,
    } as unknown as DrivingLicenseFakeData)

    expect(result.isEligible).toBe(false)
    expect(result.requirements).toContainEqual({
      key: RequirementKey.localResidency,
      requirementMet: false,
      daysOfResidency: 100,
    })
  })

  it('blocks B-full when the driving assessment is missing', () => {
    const result = fakeTypeEligibility(B_FULL, {
      howManyDaysHaveYouLivedInIceland: 365,
      hasDrivingAssessment: NO,
    } as unknown as DrivingLicenseFakeData)

    expect(result.isEligible).toBe(false)
    expect(result.requirements).toContainEqual({
      key: RequirementKey.drivingAssessmentMissing,
      requirementMet: false,
    })
  })

  it('blocks renewal-65 on the extended-license toggle', () => {
    const result = fakeTypeEligibility(B_FULL_RENEWAL_65, {
      hasExtendedLicense: YES,
    } as unknown as DrivingLicenseFakeData)

    expect(result.isEligible).toBe(false)
    expect(result.requirements).toContainEqual({
      key: RequirementKey.noExtendedDrivingLicense,
      requirementMet: false,
    })
  })

  it('blocks renewal-65 on the blocking-remark toggle without adding a row', () => {
    const result = fakeTypeEligibility(B_FULL_RENEWAL_65, {
      hasRenewalBlockingRemark: YES,
    } as unknown as DrivingLicenseFakeData)

    expect(result.isEligible).toBe(false)
    expect(
      result.requirements.some(
        (r) => r.key === RequirementKey.noExtendedDrivingLicense,
      ),
    ).toBe(false)
  })

  it('keeps renewal-65 eligible with neither toggle set', () => {
    expect(
      fakeTypeEligibility(B_FULL_RENEWAL_65, {} as DrivingLicenseFakeData)
        .isEligible,
    ).toBe(true)
  })
})
