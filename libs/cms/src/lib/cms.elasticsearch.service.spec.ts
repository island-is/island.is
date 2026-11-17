/**
 * @jest-environment node
 */
import { ElasticService } from '@island.is/content-search-toolkit'
import { CmsElasticsearchService } from './cms.elasticsearch.service'
import { GrantStatus } from './models/grant.model'

describe('CmsElasticsearchService.getGrants', () => {
  const now = new Date('2026-06-15T12:00:00.000Z')

  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(now)
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('recomputes status for Automatic grants instead of trusting the frozen indexed value', async () => {
    const staleGrant = {
      id: 'grant-1',
      name: 'A grant',
      lastUpdateTimestamp: '2026-01-01T00:00:00.000Z',
      dateFrom: '2026-05-01',
      dateTo: '2026-06-01', // already passed relative to `now`
      status: GrantStatus.OPEN, // stale value frozen in at last reindex
      statusText: undefined,
    }

    const findByQuery = jest.fn().mockResolvedValue({
      body: {
        hits: {
          total: { value: 1 },
          hits: [
            {
              _source: {
                response: JSON.stringify(staleGrant),
                tags: [{ type: 'status', key: 'Automatic' }],
              },
            },
          ],
        },
      },
    })

    const service = new CmsElasticsearchService({
      findByQuery,
    } as unknown as ElasticService)

    const result = await service.getGrants('some-index', { lang: 'is' })

    expect(result.items).toHaveLength(1)
    expect(result.items[0].status).toBe(GrantStatus.CLOSED)
  })

  it('leaves status untouched for non-Automatic grants', async () => {
    const grant = {
      id: 'grant-2',
      name: 'A note-based grant',
      lastUpdateTimestamp: '2026-01-01T00:00:00.000Z',
      dateFrom: '2026-05-01',
      dateTo: '2026-06-01',
      status: GrantStatus.CLOSED_WITH_NOTE,
      statusText: 'Some note',
    }

    const findByQuery = jest.fn().mockResolvedValue({
      body: {
        hits: {
          total: { value: 1 },
          hits: [
            {
              _source: {
                response: JSON.stringify(grant),
                tags: [{ type: 'status', key: 'Closed with note' }],
              },
            },
          ],
        },
      },
    })

    const service = new CmsElasticsearchService({
      findByQuery,
    } as unknown as ElasticService)

    const result = await service.getGrants('some-index', { lang: 'is' })

    expect(result.items[0].status).toBe(GrantStatus.CLOSED_WITH_NOTE)
    expect(result.items[0].statusText).toBe('Some note')
  })
})

describe('CmsElasticsearchService.getGrants category filtering', () => {
  const emptyResponse = {
    body: { hits: { total: { value: 0 }, hits: [] } },
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getMust = (findByQuery: jest.Mock): Record<string, any>[] =>
    findByQuery.mock.calls[0][1].query.bool.must

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tagKeysInQuery = (query: Record<string, any>): string[] =>
    JSON.stringify(query).match(/"tags\.key":(\["[^\]]*\]|"[^"]*")/g) ?? []

  it('requires a match in every tag group when tag groups are given', async () => {
    const findByQuery = jest.fn().mockResolvedValue(emptyResponse)
    const service = new CmsElasticsearchService({
      findByQuery,
    } as unknown as ElasticService)

    await service.getGrants('some-index', {
      lang: 'is',
      categories: ['nam', 'evropa'],
      tagGroups: { flokkur: ['nam', 'thjalfun'], svaedi: ['evropa'] },
    })

    const tagQueries = getMust(findByQuery).filter(
      (clause) => tagKeysInQuery(clause).length > 0,
    )
    expect(tagQueries).toHaveLength(2)
    expect(tagKeysInQuery(tagQueries[0])).toEqual(['"tags.key":"nam"'])
    expect(tagKeysInQuery(tagQueries[1])).toEqual(['"tags.key":"evropa"'])
  })

  it('keeps the category filter when tag groups are empty', async () => {
    const findByQuery = jest.fn().mockResolvedValue(emptyResponse)
    const service = new CmsElasticsearchService({
      findByQuery,
    } as unknown as ElasticService)

    await service.getGrants('some-index', {
      lang: 'is',
      categories: ['nam'],
      tagGroups: {},
    })

    const tagQueries = getMust(findByQuery).filter(
      (clause) => tagKeysInQuery(clause).length > 0,
    )
    expect(tagQueries).toHaveLength(1)
    expect(tagKeysInQuery(tagQueries[0])).toEqual(['"tags.key":["nam"]'])
  })

  it('keeps the category filter when a category has no tag group', async () => {
    const findByQuery = jest.fn().mockResolvedValue(emptyResponse)
    const service = new CmsElasticsearchService({
      findByQuery,
    } as unknown as ElasticService)

    await service.getGrants('some-index', {
      lang: 'is',
      categories: ['nam', 'evropa'],
      tagGroups: { flokkur: ['nam'] },
    })

    const tagQueries = getMust(findByQuery).filter(
      (clause) => tagKeysInQuery(clause).length > 0,
    )
    expect(tagQueries).toHaveLength(1)
    expect(tagKeysInQuery(tagQueries[0])).toEqual([
      '"tags.key":["nam","evropa"]',
    ])
  })

  it('matches any category when no tag groups are given', async () => {
    const findByQuery = jest.fn().mockResolvedValue(emptyResponse)
    const service = new CmsElasticsearchService({
      findByQuery,
    } as unknown as ElasticService)

    await service.getGrants('some-index', {
      lang: 'is',
      categories: ['nam', 'evropa'],
    })

    const tagQueries = getMust(findByQuery).filter(
      (clause) => tagKeysInQuery(clause).length > 0,
    )
    expect(tagQueries).toHaveLength(1)
    expect(tagKeysInQuery(tagQueries[0])).toEqual([
      '"tags.key":["nam","evropa"]',
    ])
  })
})
