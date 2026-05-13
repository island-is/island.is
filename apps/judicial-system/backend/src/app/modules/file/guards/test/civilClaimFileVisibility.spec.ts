import {
  CaseFileCategory,
  CaseState,
  CaseType,
  User,
  UserRole,
} from '@island.is/judicial-system/types'

import { CivilClaimant, Defendant } from '../../../repository'
import { canLimitedAccessUserViewCaseFile } from '../caseFileCategory'
import { canDefenceUserViewCivilClaimCaseFile } from '../civilClaimFileVisibility'

describe('canDefenceUserViewCivilClaimCaseFile', () => {
  const defenderNationalId = '1234567890'
  const claimantId = 'claimant-uuid'
  const defendantId = 'defendant-uuid'

  const baseArgs = {
    category: CaseFileCategory.CIVIL_CLAIM as CaseFileCategory,
    civilClaimantId: claimantId,
    defendants: [] as Defendant[],
    civilClaimants: [] as CivilClaimant[],
  }

  it('returns true for non-CIVIL_CLAIM categories', () => {
    expect(
      canDefenceUserViewCivilClaimCaseFile(defenderNationalId, {
        ...baseArgs,
        category: CaseFileCategory.COURT_RECORD,
      }),
    ).toBe(true)
  })

  it('returns true for CIVIL_CLAIM without civilClaimantId (legacy)', () => {
    expect(
      canDefenceUserViewCivilClaimCaseFile(defenderNationalId, {
        ...baseArgs,
        civilClaimantId: null,
      }),
    ).toBe(true)

    expect(
      canDefenceUserViewCivilClaimCaseFile(defenderNationalId, {
        ...baseArgs,
        civilClaimantId: undefined,
      }),
    ).toBe(true)
  })

  it('returns true when claimant has no LÖKE numbers (legacy)', () => {
    expect(
      canDefenceUserViewCivilClaimCaseFile(defenderNationalId, {
        ...baseArgs,
        civilClaimants: [
          { id: claimantId, policeCaseNumbers: [] } as unknown as CivilClaimant,
        ],
      }),
    ).toBe(true)

    expect(
      canDefenceUserViewCivilClaimCaseFile(defenderNationalId, {
        ...baseArgs,
        civilClaimants: [
          { id: claimantId, policeCaseNumbers: undefined } as CivilClaimant,
        ],
      }),
    ).toBe(true)
  })

  it('returns false when claimant has LÖKE numbers but no matching defender', () => {
    expect(
      canDefenceUserViewCivilClaimCaseFile(defenderNationalId, {
        ...baseArgs,
        civilClaimants: [
          {
            id: claimantId,
            policeCaseNumbers: ['007-2024'],
          } as CivilClaimant,
        ],
        defendants: [
          {
            id: defendantId,
            isDefenderChoiceConfirmed: true,
            defenderNationalId: '9999999999',
            policeCaseNumbers: ['007-2024'],
          } as Defendant,
        ],
      }),
    ).toBe(false)
  })

  it('returns false when defender matches but choice is not confirmed', () => {
    expect(
      canDefenceUserViewCivilClaimCaseFile(defenderNationalId, {
        ...baseArgs,
        civilClaimants: [
          {
            id: claimantId,
            policeCaseNumbers: ['007-2024'],
          } as CivilClaimant,
        ],
        defendants: [
          {
            id: defendantId,
            isDefenderChoiceConfirmed: false,
            defenderNationalId: defenderNationalId,
            policeCaseNumbers: ['007-2024'],
          } as Defendant,
        ],
      }),
    ).toBe(false)
  })

  it('returns false when defender matches but LÖKE sets do not overlap', () => {
    expect(
      canDefenceUserViewCivilClaimCaseFile(defenderNationalId, {
        ...baseArgs,
        civilClaimants: [
          {
            id: claimantId,
            policeCaseNumbers: ['007-2024'],
          } as CivilClaimant,
        ],
        defendants: [
          {
            id: defendantId,
            isDefenderChoiceConfirmed: true,
            defenderNationalId: defenderNationalId,
            policeCaseNumbers: ['008-2024'],
          } as Defendant,
        ],
      }),
    ).toBe(false)
  })

  it('returns true when defender is confirmed and shares a LÖKE number with the claimant', () => {
    expect(
      canDefenceUserViewCivilClaimCaseFile(defenderNationalId, {
        ...baseArgs,
        civilClaimants: [
          {
            id: claimantId,
            policeCaseNumbers: ['007-2024', '009-2024'],
          } as CivilClaimant,
        ],
        defendants: [
          {
            id: defendantId,
            isDefenderChoiceConfirmed: true,
            defenderNationalId: '123456-7890',
            policeCaseNumbers: ['007-2024'],
          } as Defendant,
        ],
      }),
    ).toBe(true)
  })

  it('returns true when any of multiple defendants matches', () => {
    expect(
      canDefenceUserViewCivilClaimCaseFile(defenderNationalId, {
        ...baseArgs,
        civilClaimants: [
          {
            id: claimantId,
            policeCaseNumbers: ['007-2024'],
          } as CivilClaimant,
        ],
        defendants: [
          {
            id: 'd1',
            isDefenderChoiceConfirmed: true,
            defenderNationalId: '8888888888',
            policeCaseNumbers: ['007-2024'],
          } as Defendant,
          {
            id: defendantId,
            isDefenderChoiceConfirmed: true,
            defenderNationalId: defenderNationalId,
            policeCaseNumbers: ['007-2024'],
          } as Defendant,
        ],
      }),
    ).toBe(true)
  })
})

describe('canLimitedAccessUserViewCaseFile — CIVIL_CLAIM LÖKE scoping', () => {
  const defender: User = {
    role: UserRole.DEFENDER,
    nationalId: '1234567890',
    name: 'Test Defender',
  } as User

  it('denies CIVIL_CLAIM when defender is not linked via overlapping LÖKE numbers', () => {
    expect(
      canLimitedAccessUserViewCaseFile({
        user: defender,
        caseType: CaseType.INDICTMENT,
        caseState: CaseState.RECEIVED,
        caseFileCategory: CaseFileCategory.CIVIL_CLAIM,
        defendants: [
          {
            id: 'd1',
            isDefenderChoiceConfirmed: true,
            caseFilesSharedWithDefender: true,
            defenderNationalId: '1234567890',
            policeCaseNumbers: ['111-2024'],
          } as Defendant,
        ],
        civilClaimants: [
          {
            id: 'c1',
            policeCaseNumbers: ['222-2024'],
          } as CivilClaimant,
        ],
        civilClaimantId: 'c1',
      }),
    ).toBe(false)
  })

  it('allows CIVIL_CLAIM when defender shares a LÖKE number with the claimant', () => {
    expect(
      canLimitedAccessUserViewCaseFile({
        user: defender,
        caseType: CaseType.INDICTMENT,
        caseState: CaseState.RECEIVED,
        caseFileCategory: CaseFileCategory.CIVIL_CLAIM,
        defendants: [
          {
            id: 'd1',
            isDefenderChoiceConfirmed: true,
            caseFilesSharedWithDefender: true,
            defenderNationalId: '1234567890',
            policeCaseNumbers: ['111-2024'],
          } as Defendant,
        ],
        civilClaimants: [
          {
            id: 'c1',
            policeCaseNumbers: ['111-2024'],
          } as CivilClaimant,
        ],
        civilClaimantId: 'c1',
      }),
    ).toBe(true)
  })
})
