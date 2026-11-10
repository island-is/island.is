import { sortAppealCourtSessionsByDate } from './appealCourtSession'

describe('sortAppealCourtSessionsByDate', () => {
  it('orders every dated session, earliest first, past ones included', () => {
    const later = { id: 'later', sessionDate: new Date(2026, 3, 20) }
    const held = { id: 'held', sessionDate: '2025-01-05T10:00:00.000Z' }
    const sooner = { id: 'sooner', sessionDate: new Date(2026, 2, 25) }

    expect(sortAppealCourtSessionsByDate([held, sooner, later])).toEqual([
      held,
      sooner,
      later,
    ])
  })

  it('leaves out a session without a usable date', () => {
    const dated = { id: 'dated', sessionDate: new Date(2026, 2, 25) }

    expect(
      sortAppealCourtSessionsByDate([
        { id: 'none', sessionDate: null },
        { id: 'bad', sessionDate: 'not a date' },
        dated,
      ]),
    ).toEqual([dated])
    expect(sortAppealCourtSessionsByDate(undefined)).toEqual([])
  })
})
