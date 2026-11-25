import { getStatistics } from '../../gen/fetch'
import type { AggregateStatisticsDto } from '../../gen/fetch'
import { DirectorateOfEqualityStatisticsClientService } from './directorate-of-equality-statistics.service'

jest.mock('../../gen/fetch', () => ({ getStatistics: jest.fn() }))
// Same behaviour as the real helper, without loading the middleware stack.
jest.mock('@island.is/clients/middlewares', () => ({
  data: (promise: Promise<{ data: unknown }>) =>
    promise.then((response) => response.data),
}))

const getStatisticsMock = getStatistics as jest.MockedFunction<
  typeof getStatistics
>

const statistics = (expiresAt: Date): AggregateStatisticsDto => ({
  generatedAt: new Date('2026-09-25T10:00:00Z'),
  expiresAt,
  minimumCohort: 5,
  regions: [],
  companies: [],
  rounds: [],
  employees: [],
})

const respond = (value: AggregateStatisticsDto) =>
  getStatisticsMock.mockResolvedValueOnce({
    data: value,
    request: new Request('http://localhost'),
    response: new Response(),
  } as Awaited<ReturnType<typeof getStatistics>>)

describe('DirectorateOfEqualityStatisticsClientService', () => {
  const now = new Date('2026-09-25T12:00:00Z')
  let service: DirectorateOfEqualityStatisticsClientService

  beforeEach(() => {
    jest.useFakeTimers({ now })
    getStatisticsMock.mockReset()
    service = new DirectorateOfEqualityStatisticsClientService()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('reuses the response until it expires', async () => {
    const expiresAt = new Date('2026-09-26T00:00:00Z')
    respond(statistics(expiresAt))

    const first = await service.getStatistics()
    const second = await service.getStatistics()

    expect(getStatisticsMock).toHaveBeenCalledTimes(1)
    expect(second).toBe(first)
  })

  it('fetches again once the response has expired', async () => {
    respond(statistics(new Date('2026-09-26T00:00:00Z')))
    respond(statistics(new Date('2026-09-27T00:00:00Z')))

    await service.getStatistics()
    jest.setSystemTime(new Date('2026-09-26T00:00:01Z'))
    const refreshed = await service.getStatistics()

    expect(getStatisticsMock).toHaveBeenCalledTimes(2)
    expect(refreshed.expiresAt).toEqual(new Date('2026-09-27T00:00:00Z'))
  })

  it('shares one request between concurrent calls', async () => {
    respond(statistics(new Date('2026-09-26T00:00:00Z')))

    await Promise.all([
      service.getStatistics(),
      service.getStatistics(),
      service.getStatistics(),
    ])

    expect(getStatisticsMock).toHaveBeenCalledTimes(1)
  })

  it('does not cache a failure', async () => {
    getStatisticsMock.mockRejectedValueOnce(new Error('X-Road down'))
    respond(statistics(new Date('2026-09-26T00:00:00Z')))

    await expect(service.getStatistics()).rejects.toThrow('X-Road down')
    await expect(service.getStatistics()).resolves.toMatchObject({
      minimumCohort: 5,
    })
    expect(getStatisticsMock).toHaveBeenCalledTimes(2)
  })

  it('rejects an empty response instead of caching it', async () => {
    getStatisticsMock.mockResolvedValueOnce({
      data: undefined,
      request: new Request('http://localhost'),
      response: new Response(),
    } as unknown as Awaited<ReturnType<typeof getStatistics>>)

    await expect(service.getStatistics()).rejects.toThrow('no body')
  })
})
