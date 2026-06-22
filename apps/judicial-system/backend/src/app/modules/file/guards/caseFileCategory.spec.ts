import {
  CaseFileCategory,
  CaseState,
  CaseType,
  User,
  UserRole,
} from '@island.is/judicial-system/types'

import { CourtSession, CivilClaimant, Defendant } from '../../repository'
import {
  canLimitedAccessUserViewCaseFile,
  getConfirmedDefendantsForDefender,
  getDefenceUserVisiblePoliceCaseNumbers,
  getDefenderVisiblePoliceCaseNumbers,
  getSpokespersonVisiblePoliceCaseNumbers,
  isConfirmedDefenderOfSpecificDefendant,
  isRulingOrderInConfirmedCourtSession,
} from './caseFileCategory'

const makeDefendant = (
  overrides: Partial<{
    id: string
    defenderNationalId: string
    isDefenderChoiceConfirmed: boolean
    policeCaseNumbers: string[]
  }> = {},
): Defendant =>
  ({
    id: overrides.id ?? 'defendant-id',
    defenderNationalId: overrides.defenderNationalId ?? null,
    isDefenderChoiceConfirmed: overrides.isDefenderChoiceConfirmed ?? false,
    policeCaseNumbers: overrides.policeCaseNumbers ?? [],
  } as unknown as Defendant)

const makeCivilClaimant = (
  overrides: Partial<{
    spokespersonNationalId: string
    isSpokespersonConfirmed: boolean
    caseFilesSharedWithSpokesperson: boolean
    policeCaseNumbers: string[]
    hasSpokesperson: boolean
  }> = {},
): CivilClaimant =>
  ({
    hasSpokesperson: overrides.hasSpokesperson ?? true,
    isSpokespersonConfirmed: overrides.isSpokespersonConfirmed ?? true,
    caseFilesSharedWithSpokesperson:
      overrides.caseFilesSharedWithSpokesperson ?? true,
    spokespersonNationalId: overrides.spokespersonNationalId ?? '1234567890',
    policeCaseNumbers: overrides.policeCaseNumbers ?? [],
  } as unknown as CivilClaimant)

describe('getDefenderVisiblePoliceCaseNumbers', () => {
  it('should return all police case numbers when no defendants have police case numbers (legacy case)', () => {
    const allNumbers = ['007-2026-1', '007-2026-2', '007-2026-3']
    const defendants = [
      makeDefendant({
        defenderNationalId: '1234567890',
        isDefenderChoiceConfirmed: true,
        policeCaseNumbers: [],
      }),
      makeDefendant({
        defenderNationalId: '0987654321',
        isDefenderChoiceConfirmed: true,
        policeCaseNumbers: [],
      }),
    ]

    const result = getDefenderVisiblePoliceCaseNumbers(
      '1234567890',
      defendants,
      allNumbers,
    )

    expect(result.sort()).toEqual(allNumbers.sort())
  })

  it('should return all police case numbers when defendants array is empty', () => {
    const allNumbers = ['007-2026-1', '007-2026-2']

    const result = getDefenderVisiblePoliceCaseNumbers(
      '1234567890',
      [],
      allNumbers,
    )

    expect(result.sort()).toEqual(allNumbers.sort())
  })

  it('should return all police case numbers when defendants is undefined', () => {
    const allNumbers = ['007-2026-1', '007-2026-2']

    const result = getDefenderVisiblePoliceCaseNumbers(
      '1234567890',
      undefined as unknown as Defendant[],
      allNumbers,
    )

    expect(result.sort()).toEqual(allNumbers.sort())
  })

  it('should return only own defendant police case numbers plus unassigned', () => {
    const allNumbers = ['007-2026-1', '007-2026-2', '007-2026-3']
    const defendants = [
      makeDefendant({
        defenderNationalId: '1234567890',
        isDefenderChoiceConfirmed: true,
        policeCaseNumbers: ['007-2026-1'],
      }),
      makeDefendant({
        defenderNationalId: '0987654321',
        isDefenderChoiceConfirmed: true,
        policeCaseNumbers: ['007-2026-2'],
      }),
    ]

    const result = getDefenderVisiblePoliceCaseNumbers(
      '1234567890',
      defendants,
      allNumbers,
    )

    expect(result.sort()).toEqual(['007-2026-1', '007-2026-3'].sort())
  })

  it('should return union when defender represents multiple defendants', () => {
    const allNumbers = ['007-2026-1', '007-2026-2', '007-2026-3']
    const defendants = [
      makeDefendant({
        defenderNationalId: '1234567890',
        isDefenderChoiceConfirmed: true,
        policeCaseNumbers: ['007-2026-1'],
      }),
      makeDefendant({
        defenderNationalId: '1234567890',
        isDefenderChoiceConfirmed: true,
        policeCaseNumbers: ['007-2026-2'],
      }),
      makeDefendant({
        defenderNationalId: '0987654321',
        isDefenderChoiceConfirmed: true,
        policeCaseNumbers: ['007-2026-3'],
      }),
    ]

    const result = getDefenderVisiblePoliceCaseNumbers(
      '1234567890',
      defendants,
      allNumbers,
    )

    expect(result.sort()).toEqual(['007-2026-1', '007-2026-2'].sort())
  })

  it('should return only unassigned when defender is not found in defendants', () => {
    const allNumbers = ['007-2026-1', '007-2026-2', '007-2026-3']
    const defendants = [
      makeDefendant({
        defenderNationalId: '0987654321',
        isDefenderChoiceConfirmed: true,
        policeCaseNumbers: ['007-2026-1', '007-2026-2'],
      }),
    ]

    const result = getDefenderVisiblePoliceCaseNumbers(
      '1234567890',
      defendants,
      allNumbers,
    )

    expect(result.sort()).toEqual(['007-2026-3'].sort())
  })

  it('should treat unconfirmed defender choice as not being a defender', () => {
    const allNumbers = ['007-2026-1', '007-2026-2']
    const defendants = [
      makeDefendant({
        defenderNationalId: '1234567890',
        isDefenderChoiceConfirmed: false,
        policeCaseNumbers: ['007-2026-1'],
      }),
      makeDefendant({
        defenderNationalId: '0987654321',
        isDefenderChoiceConfirmed: true,
        policeCaseNumbers: ['007-2026-2'],
      }),
    ]

    const result = getDefenderVisiblePoliceCaseNumbers(
      '1234567890',
      defendants,
      allNumbers,
    )

    // Both numbers are assigned to defendants. The user's defendant has
    // unconfirmed defender choice, so the user is not recognized as a
    // defender of anyone. assignedToMe is empty, and there are no
    // unassigned numbers, so the result is empty.
    expect(result).toEqual([])
  })

  it('should handle shared LÖKE number between defendants', () => {
    const allNumbers = ['007-2026-1', '007-2026-2']
    const defendants = [
      makeDefendant({
        defenderNationalId: '1234567890',
        isDefenderChoiceConfirmed: true,
        policeCaseNumbers: ['007-2026-1'],
      }),
      makeDefendant({
        defenderNationalId: '0987654321',
        isDefenderChoiceConfirmed: true,
        policeCaseNumbers: ['007-2026-1', '007-2026-2'],
      }),
    ]

    const result = getDefenderVisiblePoliceCaseNumbers(
      '1234567890',
      defendants,
      allNumbers,
    )

    expect(result).toEqual(['007-2026-1'])
  })
})

describe('getSpokespersonVisiblePoliceCaseNumbers', () => {
  it('should return all police case numbers when civil claimant has no police case numbers', () => {
    const allNumbers = ['007-2026-1', '007-2026-2', '007-2026-3']
    const civilClaimants = [
      makeCivilClaimant({
        spokespersonNationalId: '1234567890',
        policeCaseNumbers: [],
      }),
    ]

    const result = getSpokespersonVisiblePoliceCaseNumbers(
      '1234567890',
      civilClaimants,
      [],
      allNumbers,
    )

    expect(result.sort()).toEqual(allNumbers.sort())
  })

  it('should return only civil claimant police case numbers plus unassigned', () => {
    const allNumbers = ['007-2026-1', '007-2026-2', '007-2026-3']
    const civilClaimants = [
      makeCivilClaimant({
        spokespersonNationalId: '1234567890',
        policeCaseNumbers: ['007-2026-1'],
      }),
    ]
    const defendants = [
      makeDefendant({
        defenderNationalId: '0987654321',
        isDefenderChoiceConfirmed: true,
        policeCaseNumbers: ['007-2026-2'],
      }),
    ]

    const result = getSpokespersonVisiblePoliceCaseNumbers(
      '1234567890',
      civilClaimants,
      defendants,
      allNumbers,
    )

    expect(result.sort()).toEqual(['007-2026-1', '007-2026-3'].sort())
  })

  it('should return empty array when user is not a confirmed spokesperson', () => {
    const allNumbers = ['007-2026-1', '007-2026-2']
    const civilClaimants = [
      makeCivilClaimant({
        spokespersonNationalId: '0987654321',
        policeCaseNumbers: ['007-2026-1'],
      }),
    ]

    const result = getSpokespersonVisiblePoliceCaseNumbers(
      '1234567890',
      civilClaimants,
      [],
      allNumbers,
    )

    expect(result).toEqual([])
  })

  it('should return empty array when case files are not shared with spokesperson', () => {
    const allNumbers = ['007-2026-1', '007-2026-2']
    const civilClaimants = [
      makeCivilClaimant({
        spokespersonNationalId: '1234567890',
        caseFilesSharedWithSpokesperson: false,
        policeCaseNumbers: ['007-2026-1'],
      }),
    ]

    const result = getSpokespersonVisiblePoliceCaseNumbers(
      '1234567890',
      civilClaimants,
      [],
      allNumbers,
    )

    expect(result).toEqual([])
  })
})

describe('getDefenceUserVisiblePoliceCaseNumbers', () => {
  it('should return union of defender and spokesperson visible numbers', () => {
    const allNumbers = ['007-2026-1', '007-2026-2', '007-2026-3']
    const defendants = [
      makeDefendant({
        defenderNationalId: '1234567890',
        isDefenderChoiceConfirmed: true,
        policeCaseNumbers: ['007-2026-1'],
      }),
      makeDefendant({
        defenderNationalId: '0987654321',
        isDefenderChoiceConfirmed: true,
        policeCaseNumbers: ['007-2026-2'],
      }),
    ]
    const civilClaimants = [
      makeCivilClaimant({
        spokespersonNationalId: '1234567890',
        policeCaseNumbers: ['007-2026-2'],
      }),
    ]

    const result = getDefenceUserVisiblePoliceCaseNumbers(
      '1234567890',
      defendants,
      civilClaimants,
      allNumbers,
    )

    expect(result.sort()).toEqual(['007-2026-1', '007-2026-2', '007-2026-3'].sort())
  })

  it('should apply defender visibility rules when user is neither defender nor spokesperson', () => {
    const allNumbers = ['007-2026-1', '007-2026-2', '007-2026-3']
    const defendants = [
      makeDefendant({
        defenderNationalId: '0987654321',
        isDefenderChoiceConfirmed: true,
        policeCaseNumbers: ['007-2026-1', '007-2026-2'],
      }),
    ]

    const result = getDefenceUserVisiblePoliceCaseNumbers(
      '1234567890',
      defendants,
      [],
      allNumbers,
    )

    expect(result).toEqual(['007-2026-3'])
  })
})

describe('getConfirmedDefendantsForDefender', () => {
  it('should return only defendants where user is confirmed defender', () => {
    const confirmedDefendant = makeDefendant({
      id: 'defendant-1',
      defenderNationalId: '1234567890',
      isDefenderChoiceConfirmed: true,
    })
    const unconfirmedDefendant = makeDefendant({
      id: 'defendant-2',
      defenderNationalId: '1234567890',
      isDefenderChoiceConfirmed: false,
    })
    const otherDefenderDefendant = makeDefendant({
      id: 'defendant-3',
      defenderNationalId: '0987654321',
      isDefenderChoiceConfirmed: true,
    })

    const result = getConfirmedDefendantsForDefender('1234567890', [
      confirmedDefendant,
      unconfirmedDefendant,
      otherDefenderDefendant,
    ])

    expect(result).toEqual([confirmedDefendant])
  })

  it('should return multiple defendants when defender represents multiple defendants', () => {
    const defendant1 = makeDefendant({
      id: 'defendant-1',
      defenderNationalId: '1234567890',
      isDefenderChoiceConfirmed: true,
    })
    const defendant2 = makeDefendant({
      id: 'defendant-2',
      defenderNationalId: '1234567890',
      isDefenderChoiceConfirmed: true,
    })

    const result = getConfirmedDefendantsForDefender('1234567890', [
      defendant1,
      defendant2,
    ])

    expect(result).toEqual([defendant1, defendant2])
  })

  it('should return empty array when defendants is undefined', () => {
    const result = getConfirmedDefendantsForDefender('1234567890', undefined)

    expect(result).toEqual([])
  })

  it('should return empty array when no defendants match', () => {
    const defendants = [
      makeDefendant({
        defenderNationalId: '0987654321',
        isDefenderChoiceConfirmed: true,
      }),
    ]

    const result = getConfirmedDefendantsForDefender('1234567890', defendants)

    expect(result).toEqual([])
  })
})

describe('isRulingOrderInConfirmedCourtSession', () => {
  const fileId = 'ruling-order-file-id'

  const makeSession = (
    overrides: Partial<{ isConfirmed: boolean; rulingFileId: string | null }>,
  ): CourtSession =>
    ({
      isConfirmed: overrides.isConfirmed ?? false,
      rulingFileId: 'rulingFileId' in overrides ? overrides.rulingFileId : null,
    } as unknown as CourtSession)

  it('should return true when a confirmed session references the file', () => {
    const courtSessions = [
      makeSession({ isConfirmed: false, rulingFileId: 'other' }),
      makeSession({ isConfirmed: true, rulingFileId: fileId }),
    ]

    expect(isRulingOrderInConfirmedCourtSession(fileId, courtSessions)).toBe(
      true,
    )
  })

  it('should return false when the referencing session is not confirmed', () => {
    const courtSessions = [
      makeSession({ isConfirmed: false, rulingFileId: fileId }),
    ]

    expect(isRulingOrderInConfirmedCourtSession(fileId, courtSessions)).toBe(
      false,
    )
  })

  it('should return false when no session references the file', () => {
    const courtSessions = [
      makeSession({ isConfirmed: true, rulingFileId: 'other' }),
    ]

    expect(isRulingOrderInConfirmedCourtSession(fileId, courtSessions)).toBe(
      false,
    )
  })

  it('should return false when there are no court sessions', () => {
    expect(isRulingOrderInConfirmedCourtSession(fileId, undefined)).toBe(false)
  })
})

describe('canLimitedAccessUserViewCaseFile - ruling order', () => {
  const defenceUser = {
    role: UserRole.DEFENDER,
    nationalId: '1234567890',
    name: 'Verjandi',
  } as User

  const viewRulingOrder = (isRulingOrderInConfirmedCourtSession: boolean) =>
    canLimitedAccessUserViewCaseFile({
      user: defenceUser,
      caseType: CaseType.INDICTMENT,
      caseState: CaseState.RECEIVED,
      caseFileCategory: CaseFileCategory.COURT_INDICTMENT_RULING_ORDER,
      isRulingOrderInConfirmedCourtSession,
    })

  it('should hide a ruling order that is not in a confirmed court session', () => {
    expect(viewRulingOrder(false)).toBe(false)
  })

  it('should show a ruling order that is in a confirmed court session', () => {
    expect(viewRulingOrder(true)).toBe(true)
  })
})

describe('isConfirmedDefenderOfSpecificDefendant', () => {
  it('should return true when user is confirmed defender of the specific defendant', () => {
    const defendants = [
      makeDefendant({
        id: 'defendant-1',
        defenderNationalId: '1234567890',
        isDefenderChoiceConfirmed: true,
      }),
      makeDefendant({
        id: 'defendant-2',
        defenderNationalId: '0987654321',
        isDefenderChoiceConfirmed: true,
      }),
    ]

    const result = isConfirmedDefenderOfSpecificDefendant(
      '1234567890',
      'defendant-1',
      defendants,
    )

    expect(result).toBe(true)
  })

  it('should return false when user is not confirmed defender of the specific defendant', () => {
    const defendants = [
      makeDefendant({
        id: 'defendant-1',
        defenderNationalId: '1234567890',
        isDefenderChoiceConfirmed: true,
      }),
      makeDefendant({
        id: 'defendant-2',
        defenderNationalId: '0987654321',
        isDefenderChoiceConfirmed: true,
      }),
    ]

    const result = isConfirmedDefenderOfSpecificDefendant(
      '1234567890',
      'defendant-2',
      defendants,
    )

    expect(result).toBe(false)
  })
})
