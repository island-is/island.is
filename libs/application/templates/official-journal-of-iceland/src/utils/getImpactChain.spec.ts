import type { RegulationHistoryItem } from '@island.is/regulations'
import { RegulationImpactSchema } from '../lib/dataSchema'
import { getImpactChain } from './getImpactChain'

const today = new Date('2026-09-30')
const defaultMinDate = new Date('2026-10-05')

const amend = (
  id: string,
  date: string,
  text = `<p>${id}</p>`,
): RegulationImpactSchema => ({
  id,
  type: 'amend',
  name: '0100/2020',
  date,
  title: `Reglugerð ${id}`,
  text,
})

const repeal = (id: string, date: string): RegulationImpactSchema => ({
  id,
  type: 'repeal',
  name: '0100/2020',
  date,
})

const newImpact: RegulationImpactSchema = {
  id: 'new',
  type: 'amend',
  name: '0100/2020',
}

const scheduled = (date: string): RegulationHistoryItem =>
  ({
    date,
    name: '0200/2026',
    title: 'Reglugerð um breytingu',
    effect: 'amend',
    status: 'published',
  } as RegulationHistoryItem)

const chain = (
  impact: RegulationImpactSchema,
  impacts: RegulationImpactSchema[],
  history?: RegulationHistoryItem[],
) => getImpactChain({ impact, impacts, history, defaultMinDate, today })

describe('getImpactChain', () => {
  it('uses the published text when the regulation has no other changes', () => {
    expect(chain(newImpact, [])).toEqual({
      previous: undefined,
      minDate: defaultMinDate,
      hasFutureEffects: false,
      repealedOn: undefined,
      upcoming: [],
    })
  })

  it('builds a new change on the latest change and no earlier than it', () => {
    const first = amend('a', '2027-01-01')
    const second = amend('b', '2027-03-01')
    const result = chain(newImpact, [second, first])

    expect(result.previous).toBe(second)
    expect(result.minDate).toEqual(new Date('2027-03-01'))
  })

  it('compares an existing change with the change before it', () => {
    const first = amend('a', '2027-01-01')
    const second = amend('b', '2027-03-01')

    expect(chain(first, [first, second]).previous).toBeUndefined()
    expect(chain(first, [first, second]).minDate).toEqual(defaultMinDate)
    expect(chain(second, [first, second]).previous).toBe(first)
    expect(chain(second, [first, second]).minDate).toEqual(
      new Date('2027-01-01'),
    )
  })

  it('keeps the saved order for changes on the same day', () => {
    const first = amend('a', '2027-01-01')
    const second = amend('b', '2027-01-01')

    expect(chain(second, [first, second]).previous).toBe(first)
    expect(chain(first, [first, second]).previous).toBeUndefined()
  })

  it('does not build on a repeal, but does not go before it', () => {
    const change = amend('a', '2027-01-01')
    const cancel = repeal('b', '2027-02-01')
    const result = chain(newImpact, [change, cancel])

    expect(result.previous).toBe(change)
    expect(result.minDate).toEqual(new Date('2027-02-01'))
  })

  it('follows changes the API has scheduled', () => {
    const result = chain(
      newImpact,
      [],
      [scheduled('2020-05-01'), scheduled('2026-12-01')],
    )

    expect(result.hasFutureEffects).toBe(true)
    expect(result.minDate).toEqual(new Date('2026-12-01'))
  })

  it('ignores published changes', () => {
    const result = chain(newImpact, [], [scheduled('2020-05-01')])

    expect(result.hasFutureEffects).toBe(false)
    expect(result.minDate).toEqual(defaultMinDate)
  })

  it('only follows scheduled changes before an existing change', () => {
    const change = amend('a', '2027-01-01')
    const result = chain(change, [change], [scheduled('2027-06-01')])

    expect(result.hasFutureEffects).toBe(false)
    expect(result.minDate).toEqual(defaultMinDate)
  })

  it('does not allow a change after a repeal', () => {
    const change = amend('a', '2027-01-01')
    const cancel = repeal('b', '2027-02-01')

    expect(chain(newImpact, [change, cancel]).repealedOn).toBe('2027-02-01')
    expect(chain(change, [change, cancel]).repealedOn).toBeUndefined()
    expect(chain(cancel, [change, cancel]).repealedOn).toBeUndefined()
  })

  it('does not allow a change after a scheduled repeal', () => {
    const scheduledRepeal = {
      ...scheduled('2026-12-01'),
      effect: 'repeal',
    } as RegulationHistoryItem

    expect(chain(newImpact, [], [scheduledRepeal]).repealedOn).toBe(
      '2026-12-01',
    )
  })

  it('does not allow a repeal before a change', () => {
    const change = amend('a', '2027-01-01')
    const newRepeal = { ...repeal('new', ''), date: undefined }

    expect(chain(newRepeal, [change]).minDate).toEqual(new Date('2027-01-01'))
  })

  it('lists scheduled changes and the other impacts by date', () => {
    const change = amend('a', '2027-01-01')
    const cancel = repeal('b', '2027-06-01')
    const result = chain(
      change,
      [cancel, change],
      [scheduled('2020-05-01'), scheduled('2027-03-01')],
    )

    expect(result.upcoming).toEqual([
      {
        date: '2027-03-01',
        effect: 'amend',
        origin: 'api',
        name: '0200/2026',
      },
      { date: '2027-06-01', effect: 'repeal', origin: 'draft' },
    ])
  })

  it('does not allow moving a change past a scheduled repeal', () => {
    const change = amend('a', '2026-11-01')
    const scheduledRepeal = {
      ...scheduled('2026-12-01'),
      effect: 'repeal',
    } as RegulationHistoryItem
    const moved = (selectedDate?: string) =>
      getImpactChain({
        impact: change,
        impacts: [change],
        history: [scheduledRepeal],
        defaultMinDate,
        selectedDate,
        today,
      }).repealedOn

    expect(moved()).toBeUndefined()
    expect(moved('2026-11-15')).toBeUndefined()
    expect(moved('2027-01-01')).toBe('2026-12-01')
  })

  it('checks a scheduled repeal against the date the change is saved with', () => {
    // Saved before the earliest date allowed now, so it will be moved to it
    const change = amend('a', '2026-10-01')
    const scheduledRepeal = {
      ...scheduled('2026-10-02'),
      effect: 'repeal',
    } as RegulationHistoryItem

    expect(
      getImpactChain({
        impact: change,
        impacts: [change],
        history: [scheduledRepeal],
        defaultMinDate,
        today,
      }).repealedOn,
    ).toBe('2026-10-02')
  })
})
