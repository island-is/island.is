import type {
  AppealCase,
  User,
} from '@island.is/judicial-system-web/src/graphql/schema'

import {
  buildAppealCaseUpdate,
  getBenchSlots,
  getNewlyAssignedUserIds,
  hasUnsavedRoleChanges,
  isAnyRoleUnfilled,
  toPreviewAppealCase,
} from './AppealCase.logic'

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
