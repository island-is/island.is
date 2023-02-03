import { TempCase as Case } from '@island.is/judicial-system-web/src/types'
import {
  User,
  UserRole,
  CaseType,
} from '@island.is/judicial-system-web/src/graphql/schema'

import { filterCases, FilterOption, filterOptionsForUser } from './useFilter'

describe('useFilter - filterOptionsForUser', () => {
  test.each([UserRole.Assistant, UserRole.Registrar])(
    'should filter out investigation option for %s',
    (role) => {
      const user = { role: role } as User
      const options: FilterOption[] = [
        {
          label: 'ALL_CASES',
          value: 'ALL_CASES',
        },
        {
          label: 'INVESTIGATION',
          value: 'INVESTIGATION',
        },
        {
          label: 'INDICTMENT',
          value: 'INDICTMENT',
        },
        {
          label: 'MY_CASES',
          value: 'MY_CASES',
        },
      ]
      const result = filterOptionsForUser(options, user)
      expect(result).not.toEqual(
        expect.arrayContaining([
          { value: 'INVESTIGATION', label: 'INVESTIGATION' },
        ]),
      )
      expect(result.length).toBe(3)
      expect(result).toEqual(
        expect.arrayContaining([{ value: 'INDICTMENT', label: 'INDICTMENT' }]),
      )
    },
  )

  test('should return all options for others', () => {
    const user = {} as User
    const options: FilterOption[] = [
      {
        label: 'ALL_CASES',
        value: 'ALL_CASES',
      },
      {
        label: 'INVESTIGATION',
        value: 'INVESTIGATION',
      },
      {
        label: 'INDICTMENT',
        value: 'INDICTMENT',
      },
      {
        label: 'MY_CASES',
        value: 'MY_CASES',
      },
    ]
    const result = filterOptionsForUser(options, user)
    expect(result.length).toBe(4)
  })
})

describe('useFilter - filterCases', () => {
  test('should return all cases', async () => {
    const user = {} as User
    const cases = [{ id: '1' }, { id: '2' }] as Case[]

    const result = filterCases('ALL_CASES', cases, user)
    expect(result.length).toBe(2)
  })

  test('should return indicitment cases', async () => {
    const user = {} as User
    const cases = [
      { id: '1' },
      { id: '2', type: CaseType.Indictment },
    ] as Case[]

    const result = filterCases('INDICTMENT', cases, user)
    expect(result.length).toBe(1)
    expect(result).toEqual(
      expect.arrayContaining([expect.objectContaining({ id: '2' })]),
    )
  })

  test('should return investigation cases', async () => {
    const user = {} as User
    const cases = [
      { id: '1', type: CaseType.Custody },
      { id: '2', type: CaseType.Indictment },
    ] as Case[]

    const result = filterCases('INVESTIGATION', cases, user)
    expect(result.length).toBe(1)
    expect(result).toEqual(
      expect.arrayContaining([expect.objectContaining({ id: '1' })]),
    )
  })

  test('should return cases that the user is connected to', async () => {
    const user = { id: 'userId' } as User
    const otherUser = { id: 'otherUserId' } as User
    const cases = [
      { id: '1' },
      { id: '2', prosecutor: user },
      { id: '3', judge: user },
      { id: '4', registrar: user },
      { id: '5', creatingProsecutor: user },
      { id: '6', prosecutor: otherUser },
      { id: '7', judge: otherUser },
      { id: '8', registrar: otherUser },
      { id: '9', creatingProsecutor: otherUser },
    ] as Case[]

    const result = filterCases('MY_CASES', cases, user)
    expect(result.length).toBe(4)
    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: '2' }),
        expect.objectContaining({ id: '3' }),
        expect.objectContaining({ id: '4' }),
        expect.objectContaining({ id: '5' }),
      ]),
    )
  })
})
