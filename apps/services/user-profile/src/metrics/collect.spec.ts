import { Sequelize } from 'sequelize'
import { collectProfileMetrics } from './collect'

describe('profile metrics', () => {
  it('keeps unknown preferences out of the denominator and separates cohorts', async () => {
    const db = {
      query: jest.fn().mockResolvedValue([
        {
          recipient_type: 'individual',
          disabled: '2',
          known: '5',
          unknown: '3',
        },
        { recipient_type: 'company', disabled: '1', known: '2', unknown: '0' },
      ]),
    }
    const metrics = await collectProfileMetrics((db as unknown) as Sequelize)
    expect(
      metrics
        .filter((m) => m.tags?.recipient_type === 'individual')
        .map((m) => m.value),
    ).toEqual([2, 5, 3])
    expect(
      metrics
        .filter((m) => m.tags?.recipient_type === 'company')
        .map((m) => m.value),
    ).toEqual([1, 2, 0])
    expect(
      metrics
        .filter((m) => m.tags?.recipient_type === 'other')
        .map((m) => m.value),
    ).toEqual([0, 0, 0])
  })
})
