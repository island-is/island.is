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
