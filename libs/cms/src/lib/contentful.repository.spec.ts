/**
 * @jest-environment node
 */
import { ContentfulRepository } from './contentful.repository'

// Mimics the errors thrown by the Contentful SDK
const contentfulError = (status: number, message: string) => {
  const error = new Error(JSON.stringify({ status, message }))
  error.name = 'BadRequest'
  return error
}

const TOTAL = 10
const MAX_ITEMS_PER_RESPONSE = 3

const createRepository = (getEntries: jest.Mock) => {
  const repository = new ContentfulRepository()
  jest
    .spyOn(repository, 'getClient')
    .mockReturnValue(({ getEntries } as unknown) as ReturnType<
      ContentfulRepository['getClient']
    >)
  return repository
}

describe('ContentfulRepository', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('splits requests whose response is too big into smaller chunks', async () => {
    const getEntries = jest.fn(
      async ({ skip = 0, limit }: { skip?: number; limit: number }) => {
        if (limit > MAX_ITEMS_PER_RESPONSE) {
          throw contentfulError(
            400,
            'Response size too big. Maximum allowed response size: 7340032B.',
          )
        }
        const ids = Array.from({ length: TOTAL }, (_, i) => i).slice(
          skip,
          skip + limit,
        )
        return {
          total: TOTAL,
          skip,
          limit,
          items: ids.map((id) => ({ sys: { id: String(id) } })),
        }
      },
    )
    const repository = createRepository(getEntries)

    const result = await repository.getLocalizedEntries('is', { limit: 1000 })

    expect(result.items.map((item) => item.sys.id)).toEqual(
      Array.from({ length: TOTAL }, (_, i) => String(i)),
    )
    expect(result.total).toBe(TOTAL)
    expect(result.limit).toBe(1000)
  })

  it('retries rate limited requests', async () => {
    const getEntries = jest
      .fn()
      .mockRejectedValueOnce(contentfulError(429, 'Rate limit exceeded'))
      .mockResolvedValueOnce({ total: 0, skip: 0, limit: 100, items: [] })
    const repository = createRepository(getEntries)

    const promise = repository.getLocalizedEntries('is', {})
    await jest.runAllTimersAsync()

    await expect(promise).resolves.toMatchObject({ items: [] })
    expect(getEntries).toHaveBeenCalledTimes(2)
  })

  it('gives up after a limited number of retries', async () => {
    const getEntries = jest
      .fn()
      .mockRejectedValue(contentfulError(429, 'Rate limit exceeded'))
    const repository = createRepository(getEntries)

    const promise = repository.getLocalizedEntries('is', {})
    const assertion = expect(promise).rejects.toThrow('Rate limit exceeded')
    await jest.runAllTimersAsync()

    await assertion
    expect(getEntries).toHaveBeenCalledTimes(4)
  })

  it('does not retry client errors', async () => {
    const getEntries = jest
      .fn()
      .mockRejectedValue(contentfulError(400, 'Unknown field'))
    const repository = createRepository(getEntries)

    await expect(repository.getLocalizedEntries('is', {})).rejects.toThrow(
      'Unknown field',
    )
    expect(getEntries).toHaveBeenCalledTimes(1)
  })
})
