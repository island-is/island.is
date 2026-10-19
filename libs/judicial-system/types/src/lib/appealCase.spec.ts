import {
  getAppealJudges,
  getAppealJudgeUserIds,
  getOrderedAppealJudges,
  getPresidingAppealJudge,
  hasAllAppealJudges,
} from './appealCase'

const anna = { id: 'anna', name: 'Anna' }
const bjorn = { id: 'bjorn', name: 'Björn' }
const dora = { id: 'dora', name: 'Dóra' }
const einar = { id: 'einar', name: 'Einar' }

const bench = {
  appealJudges: [
    { displayOrder: 2, userId: dora.id, user: dora },
    { displayOrder: 0, userId: anna.id, user: anna },
    { displayOrder: 1, userId: bjorn.id, user: bjorn },
  ],
}

describe('getOrderedAppealJudges', () => {
  it('orders the rows by display order', () => {
    expect(getOrderedAppealJudges(bench).map((judge) => judge.userId)).toEqual([
      'anna',
      'bjorn',
      'dora',
    ])
  })

  it('drops empty rows and copes with a missing bench', () => {
    expect(getOrderedAppealJudges({ appealJudges: [null] })).toEqual([])
    expect(getOrderedAppealJudges({ appealJudges: null })).toEqual([])
    expect(getOrderedAppealJudges(undefined)).toEqual([])
    expect(getOrderedAppealJudges(null)).toEqual([])
  })
})

describe('getAppealJudges', () => {
  it('returns the judges in bench order', () => {
    expect(getAppealJudges(bench)).toEqual([anna, bjorn, dora])
  })

  it('skips rows whose user is not loaded', () => {
    expect(
      getAppealJudges({
        appealJudges: [
          { displayOrder: 0, userId: anna.id },
          { displayOrder: 1, userId: bjorn.id, user: bjorn },
        ],
      }),
    ).toEqual([bjorn])
  })
})

describe('getPresidingAppealJudge', () => {
  it('is the judge at display order 0', () => {
    expect(getPresidingAppealJudge(bench)).toEqual(anna)
  })

  it('is undefined without a bench', () => {
    expect(getPresidingAppealJudge({ appealJudges: [] })).toBeUndefined()
    expect(getPresidingAppealJudge(undefined)).toBeUndefined()
  })
})

describe('getAppealJudgeUserIds', () => {
  it('reads the user id of each row in bench order', () => {
    expect(getAppealJudgeUserIds(bench)).toEqual(['anna', 'bjorn', 'dora'])
  })

  it('falls back to the loaded user', () => {
    expect(
      getAppealJudgeUserIds({
        appealJudges: [
          { displayOrder: 1, user: bjorn },
          { displayOrder: 0, user: anna },
          { displayOrder: 2 },
        ],
      }),
    ).toEqual(['anna', 'bjorn'])
  })
})

describe('hasAllAppealJudges', () => {
  it('is true for a bench of three or more', () => {
    expect(hasAllAppealJudges(bench)).toBe(true)
    expect(
      hasAllAppealJudges({
        appealJudges: [
          ...bench.appealJudges,
          { displayOrder: 3, userId: einar.id, user: einar },
        ],
      }),
    ).toBe(true)
  })

  it('counts rows, not loaded users', () => {
    expect(
      hasAllAppealJudges({
        appealJudges: [
          { userId: anna.id },
          { userId: bjorn.id },
          { userId: dora.id },
        ],
      }),
    ).toBe(true)
  })

  it('is false for fewer than three', () => {
    expect(
      hasAllAppealJudges({ appealJudges: bench.appealJudges.slice(0, 2) }),
    ).toBe(false)
    expect(hasAllAppealJudges({ appealJudges: [] })).toBe(false)
    expect(hasAllAppealJudges(undefined)).toBe(false)
  })
})
