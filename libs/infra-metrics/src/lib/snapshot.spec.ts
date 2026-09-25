import { DogStatsD } from './dogStatsD'
import { completedDay, publishSnapshot } from './snapshot'

describe('snapshot metrics', () => {
  it('uses UTC day boundaries across month/year transitions', () => {
    expect(completedDay(new Date('2027-01-01T02:00:00Z'))).toEqual({
      start: new Date('2026-12-31T00:00:00Z'),
      end: new Date('2027-01-01T00:00:00Z'),
    })
    expect(completedDay(new Date('2026-09-24T22:00:00Z'), 8)).toEqual({
      start: new Date('2026-09-16T00:00:00Z'),
      end: new Date('2026-09-17T00:00:00Z'),
    })
  })

  const mockClient = () => ({
    gauge: jest.fn((_name, _value, _tags, callback) => callback()),
    close: jest.fn((callback) => callback()),
  })

  it('publishes absolute values on retries and waits for close', async () => {
    const client = mockClient()
    const collect = async () => [{ name: 'total', value: 4 }]
    await publishSnapshot('test', collect, (client as unknown) as DogStatsD)
    await publishSnapshot('test', collect, (client as unknown) as DogStatsD)
    expect(
      client.gauge.mock.calls
        .filter(([name]) => name === 'total')
        .map(([, value]) => value),
    ).toEqual([4, 4])
    expect(client.close).toHaveBeenCalledTimes(2)
  })

  it('does not publish fake data or success when collection fails', async () => {
    const client = mockClient()
    await expect(
      publishSnapshot(
        'test',
        async () => {
          throw new Error('database down')
        },
        (client as unknown) as DogStatsD,
      ),
    ).rejects.toThrow('database down')
    expect(client.gauge).toHaveBeenCalledTimes(1)
    expect(client.gauge.mock.calls[0].slice(0, 2)).toEqual([
      'collection.success',
      0,
    ])
    expect(client.close).toHaveBeenCalled()
  })

  it('validates the entire snapshot before sending data', async () => {
    const client = mockClient()
    await expect(
      publishSnapshot(
        'test',
        async () => [{ name: 'bad', value: NaN }],
        (client as unknown) as DogStatsD,
      ),
    ).rejects.toThrow('Invalid snapshot')
    expect(client.gauge.mock.calls.map(([name]) => name)).toEqual([
      'collection.success',
    ])
  })
})
