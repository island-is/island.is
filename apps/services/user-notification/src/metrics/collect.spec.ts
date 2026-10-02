import { Sequelize } from 'sequelize'
import { collectNotificationMetrics } from './collect'

describe('notification metrics', () => {
  const now = new Date('2026-09-24T12:00:00Z')
  it('publishes daily absolute delivery totals, including zero channels', async () => {
    const db = {
      query: jest
        .fn()
        .mockResolvedValueOnce([{ channel: 'push', total: '2' }])
        .mockResolvedValueOnce([{ started_at: new Date('2026-09-24') }]),
    }
    const metrics = await collectNotificationMetrics(
      db as unknown as Sequelize,
      now,
    )
    expect(
      metrics
        .filter((m) => m.name === 'company.deliveries_previous_day')
        .map((m) => m.value),
    ).toEqual([2, 0, 0])
    expect(db.query.mock.calls[0][1].replacements).toEqual({
      start: new Date('2026-09-23'),
      end: new Date('2026-09-24'),
    })
    expect(metrics.find((m) => m.name === 'unread_7d.available')?.value).toBe(0)
    expect(metrics.some((m) => m.name === 'unread_7d.total')).toBe(false)
  })
  it('waits for a full cohort after tracking started, not a partial first day', async () => {
    const db = {
      query: jest
        .fn()
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([
          { started_at: new Date('2026-09-16T00:00:01Z') },
        ]),
    }
    const metrics = await collectNotificationMetrics(
      db as unknown as Sequelize,
      now,
    )
    expect(metrics.find((m) => m.name === 'unread_7d.available')?.value).toBe(0)
    expect(db.query).toHaveBeenCalledTimes(2)
  })
  it('selects a mature cohort and publishes numerator and denominator', async () => {
    const db = {
      query: jest
        .fn()
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([{ started_at: new Date('2026-09-16') }])
        .mockResolvedValueOnce([{ total: '10', unread: '3' }]),
    }
    const metrics = await collectNotificationMetrics(
      db as unknown as Sequelize,
      now,
    )
    expect(db.query.mock.calls[2][1].replacements).toEqual({
      start: new Date('2026-09-16'),
      end: new Date('2026-09-17'),
    })
    expect(metrics.find((m) => m.name === 'unread_7d.unread')?.value).toBe(3)
    expect(metrics.find((m) => m.name === 'unread_7d.total')?.value).toBe(10)
  })
})
