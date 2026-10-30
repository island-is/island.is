import { Sequelize } from 'sequelize'
import { collectProfileMetrics, profileMetricsQuery } from './collect'

describe('profile metrics', () => {
  it('counts users with all notification channels disabled', async () => {
    const db = {
      query: jest.fn().mockResolvedValue([{ all_channels_disabled: '23' }]),
    }

    const metrics = await collectProfileMetrics(db as unknown as Sequelize)

    expect(metrics).toEqual([
      { name: 'all_channels_disabled_users', value: 23 },
    ])
    expect(metrics[0].tags).toBeUndefined()
    expect(db.query).toHaveBeenCalledWith(
      profileMetricsQuery,
      expect.objectContaining({ type: expect.anything() }),
    )
    expect(profileMetricsQuery).toContain('document_notifications IS NOT TRUE')
    expect(profileMetricsQuery).toContain('email_notifications IS NOT TRUE')
    expect(profileMetricsQuery).toContain('sms_notifications IS NOT TRUE')
  })
})
