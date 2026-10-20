import type {
  AppealCase,
  User,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { UserRole } from '@island.is/judicial-system-web/src/graphql/schema'

import {
  addBenchSeat,
  buildAppealCaseUpdate,
  canAddBenchSeat,
  canRemoveBenchSeat,
  getAssistantOptions,
  getBenchSlots,
  getJudgeOptions,
  getNewlyAssignedUserIds,
  hasUnsavedRoleChanges,
  isAnyRoleUnfilled,
  removeBenchSeat,
  setBenchSeat,
  toPreviewAppealCase,
} from './appealRoles.logic'

const user = (id: string): User => ({ id, name: id } as User)

const assistant = user('assistant')
const anna = user('anna')
const bjorn = user('bjorn')
const dora = user('dora')
const einar = user('einar')

const appealCaseWith = (
  appealAssistant: User | null,
  judges: User[],
): AppealCase =>
  ({
    id: 'appeal-case',
    appealAssistant,
    appealJudges: judges.map((judge, displayOrder) => ({
      id: `row-${judge.id}`,
      displayOrder,
      userId: judge.id,
      user: judge,
    })),
  } as AppealCase)

describe('getBenchSlots', () => {
  it('pads an empty bench to three seats', () => {
    expect(getBenchSlots(undefined)).toEqual([null, null, null])
    expect(getBenchSlots(appealCaseWith(null, [anna]))).toEqual([
      anna,
      null,
      null,
    ])
  })

  it('keeps every seat of a larger bench, in order', () => {
    expect(
      getBenchSlots(appealCaseWith(null, [anna, bjorn, dora, einar])),
    ).toEqual([anna, bjorn, dora, einar])
  })
})

describe('bench seats', () => {
  it('seats a judge without touching the other seats', () => {
    expect(setBenchSeat([anna, null, null], 1, bjorn)).toEqual([
      anna,
      bjorn,
      null,
    ])
  })

  it('adds empty seats up to five', () => {
    const four = addBenchSeat([anna, bjorn, dora])
    const five = addBenchSeat(four)

    expect(four).toEqual([anna, bjorn, dora, null])
    expect(canAddBenchSeat(four)).toBe(true)
    expect(five).toHaveLength(5)
    expect(canAddBenchSeat(five)).toBe(false)
    expect(addBenchSeat(five)).toBe(five)
  })

  it('only lets a seat go while there are more than three, never the presiding one', () => {
    const three = [anna, bjorn, dora]
    const four = [anna, bjorn, dora, einar]

    expect(canRemoveBenchSeat(three, 1)).toBe(false)
    expect(removeBenchSeat(three, 1)).toBe(three)
    expect(canRemoveBenchSeat(four, 0)).toBe(false)
    expect(removeBenchSeat(four, 0)).toBe(four)
    expect(canRemoveBenchSeat(four, 1)).toBe(true)
    expect(removeBenchSeat(four, 1)).toEqual([anna, dora, einar])
    expect(removeBenchSeat(four, 3)).toEqual([anna, bjorn, dora])
  })
})

describe('select options', () => {
  const users = [
    { ...assistant, role: UserRole.COURT_OF_APPEALS_ASSISTANT },
    { ...anna, role: UserRole.COURT_OF_APPEALS_JUDGE },
    { ...bjorn, role: UserRole.COURT_OF_APPEALS_JUDGE },
    { ...dora, role: UserRole.COURT_OF_APPEALS_JUDGE },
  ] as User[]

  it('offers the assistants', () => {
    expect(getAssistantOptions(users).map((o) => o.value)).toEqual([
      'assistant',
    ])
    expect(getAssistantOptions(undefined)).toEqual([])
  })

  it('offers the judges not already on the bench', () => {
    expect(
      getJudgeOptions(users, [anna, null, null]).map((o) => o.value),
    ).toEqual(['bjorn', 'dora'])
    expect(getJudgeOptions(users, [null, null, null])).toHaveLength(3)
  })
})

describe('isAnyRoleUnfilled', () => {
  it('is true while a seat or the assistant is empty', () => {
    expect(
      isAnyRoleUnfilled({ appealAssistant: assistant, judges: [anna, null] }),
    ).toBe(true)
    expect(
      isAnyRoleUnfilled({ appealAssistant: null, judges: [anna, bjorn] }),
    ).toBe(true)
    expect(
      isAnyRoleUnfilled({ appealAssistant: assistant, judges: [anna, bjorn] }),
    ).toBe(false)
  })
})

describe('hasUnsavedRoleChanges', () => {
  const saved = appealCaseWith(assistant, [anna, bjorn, dora])

  it('is false when the selection matches what is saved', () => {
    expect(
      hasUnsavedRoleChanges(saved, {
        appealAssistant: assistant,
        judges: [anna, bjorn, dora],
      }),
    ).toBe(false)
  })

  it('is true when a judge, the order or the assistant differs', () => {
    expect(
      hasUnsavedRoleChanges(saved, {
        appealAssistant: assistant,
        judges: [anna, bjorn, einar],
      }),
    ).toBe(true)
    expect(
      hasUnsavedRoleChanges(saved, {
        appealAssistant: assistant,
        judges: [bjorn, anna, dora],
      }),
    ).toBe(true)
    expect(
      hasUnsavedRoleChanges(saved, {
        appealAssistant: einar,
        judges: [anna, bjorn, dora],
      }),
    ).toBe(true)
  })
})

describe('buildAppealCaseUpdate', () => {
  const saved = appealCaseWith(assistant, [anna, bjorn, dora])

  it('is empty when nothing changed', () => {
    expect(
      buildAppealCaseUpdate(saved, {
        appealAssistant: assistant,
        judges: [anna, bjorn, dora],
      }),
    ).toEqual({})
  })

  it('sends the whole bench in order when any seat changed', () => {
    expect(
      buildAppealCaseUpdate(saved, {
        appealAssistant: assistant,
        judges: [dora, anna, bjorn],
      }),
    ).toEqual({ appealJudgeIds: ['dora', 'anna', 'bjorn'] })
  })

  it('sends only the assistant when only the assistant changed', () => {
    expect(
      buildAppealCaseUpdate(saved, {
        appealAssistant: einar,
        judges: [anna, bjorn, dora],
      }),
    ).toEqual({ appealAssistantId: 'einar' })
  })

  it('skips empty seats on a first assignment', () => {
    expect(
      buildAppealCaseUpdate(appealCaseWith(null, []), {
        appealAssistant: assistant,
        judges: [anna, null, null],
      }),
    ).toEqual({ appealAssistantId: 'assistant', appealJudgeIds: ['anna'] })
  })
})

describe('getNewlyAssignedUserIds', () => {
  it('lists the users that held no role before', () => {
    expect(
      getNewlyAssignedUserIds(appealCaseWith(assistant, [anna, bjorn]), {
        appealAssistant: assistant,
        judges: [anna, bjorn, dora],
      }),
    ).toEqual(['dora'])
  })

  it('treats a reorder as nothing new', () => {
    expect(
      getNewlyAssignedUserIds(appealCaseWith(assistant, [anna, bjorn, dora]), {
        appealAssistant: assistant,
        judges: [dora, anna, bjorn],
      }),
    ).toEqual([])
  })
})

describe('toPreviewAppealCase', () => {
  it('builds the bench rows from the filled seats, in order', () => {
    const preview = toPreviewAppealCase(appealCaseWith(null, []), {
      appealAssistant: assistant,
      judges: [anna, null, bjorn],
    })

    expect(preview.appealAssistant).toBe(assistant)
    expect(preview.appealJudges).toEqual([
      { id: 'anna', displayOrder: 0, userId: 'anna', user: anna },
      { id: 'bjorn', displayOrder: 1, userId: 'bjorn', user: bjorn },
    ])
  })
})
