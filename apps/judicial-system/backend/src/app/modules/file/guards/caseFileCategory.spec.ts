import { Defendant } from '../../repository'
import {
  getConfirmedDefendantClientsForDefender,
  getDefenderVisiblePoliceCaseNumbers,
  isConfirmedDefenderOfSpecificDefendant,
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

describe('getConfirmedDefendantClientsForDefender', () => {
  it('should return only defendants where user is confirmed defender', () => {
    const confirmedClient = makeDefendant({
      id: 'client-1',
      defenderNationalId: '1234567890',
      isDefenderChoiceConfirmed: true,
    })
    const unconfirmedClient = makeDefendant({
      id: 'client-2',
      defenderNationalId: '1234567890',
      isDefenderChoiceConfirmed: false,
    })
    const otherDefenderClient = makeDefendant({
      id: 'client-3',
      defenderNationalId: '0987654321',
      isDefenderChoiceConfirmed: true,
    })

    const result = getConfirmedDefendantClientsForDefender('1234567890', [
      confirmedClient,
      unconfirmedClient,
      otherDefenderClient,
    ])

    expect(result).toEqual([confirmedClient])
  })

  it('should return multiple defendants when defender represents multiple clients', () => {
    const client1 = makeDefendant({
      id: 'client-1',
      defenderNationalId: '1234567890',
      isDefenderChoiceConfirmed: true,
    })
    const client2 = makeDefendant({
      id: 'client-2',
      defenderNationalId: '1234567890',
      isDefenderChoiceConfirmed: true,
    })

    const result = getConfirmedDefendantClientsForDefender('1234567890', [
      client1,
      client2,
    ])

    expect(result).toEqual([client1, client2])
  })

  it('should return empty array when defendants is undefined', () => {
    const result = getConfirmedDefendantClientsForDefender(
      '1234567890',
      undefined,
    )

    expect(result).toEqual([])
  })

  it('should return empty array when no defendants match', () => {
    const defendants = [
      makeDefendant({
        defenderNationalId: '0987654321',
        isDefenderChoiceConfirmed: true,
      }),
    ]

    const result = getConfirmedDefendantClientsForDefender(
      '1234567890',
      defendants,
    )

    expect(result).toEqual([])
  })
})

describe('isConfirmedDefenderOfSpecificDefendant', () => {
  it('should return true when user is confirmed defender of the specific defendant', () => {
    const defendants = [
      makeDefendant({
        id: 'client-1',
        defenderNationalId: '1234567890',
        isDefenderChoiceConfirmed: true,
      }),
      makeDefendant({
        id: 'client-2',
        defenderNationalId: '0987654321',
        isDefenderChoiceConfirmed: true,
      }),
    ]

    const result = isConfirmedDefenderOfSpecificDefendant(
      '1234567890',
      'client-1',
      defendants,
    )

    expect(result).toBe(true)
  })

  it('should return false when user is not confirmed defender of the specific defendant', () => {
    const defendants = [
      makeDefendant({
        id: 'client-1',
        defenderNationalId: '1234567890',
        isDefenderChoiceConfirmed: true,
      }),
      makeDefendant({
        id: 'client-2',
        defenderNationalId: '0987654321',
        isDefenderChoiceConfirmed: true,
      }),
    ]

    const result = isConfirmedDefenderOfSpecificDefendant(
      '1234567890',
      'client-2',
      defendants,
    )

    expect(result).toBe(false)
  })
})
