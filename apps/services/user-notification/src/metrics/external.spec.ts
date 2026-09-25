import { externalSnapshot, queryAggregates } from './external'

jest.mock('firebase-admin/app', () => ({
  applicationDefault: () => ({
    getAccessToken: async () => ({ access_token: 'test-token' }),
  }),
  cert: () => ({
    getAccessToken: async () => ({ access_token: 'test-token' }),
  }),
}))

describe('external metric contracts', () => {
  const day = new Date('2026-09-20')
  it('does not turn missing or incomplete exports into zeros', () => {
    for (const rows of [
      [],
      [{ received: '5', opened: '2', complete: 'false' }],
    ]) {
      expect(externalSnapshot('firebase', rows, day)).toEqual([
        { name: 'external.available', value: 0 },
      ])
    }
  })
  it('validates distinct matched receipts and opens by platform', () => {
    const metrics = externalSnapshot(
      'firebase',
      [{ platform: 'android', received: '10', opened: '3', complete: 'true' }],
      day,
    )
    expect(metrics).toContainEqual({
      name: 'push.opened',
      value: 3,
      tags: { platform: 'android' },
    })
    expect(() =>
      externalSnapshot(
        'firebase',
        [{ platform: 'ios', received: '1', opened: '2', complete: 'true' }],
        day,
      ),
    ).toThrow('exceed')
    expect(() =>
      externalSnapshot(
        'firebase',
        [{ platform: 'other', received: '1', opened: '0', complete: 'true' }],
        day,
      ),
    ).toThrow('platform')
  })
  it('preserves a valid empty cohort without fabricating a percentage', () => {
    expect(
      externalSnapshot(
        'mailbox',
        [{ total: '0', unread: '0', complete: 'true' }],
        day,
      ),
    ).toContainEqual({
      name: 'unread_7d.total',
      value: 0,
      tags: { kind: 'document' },
    })
  })
  it('rejects corrupt aggregates and duplicate mailbox rows', () => {
    expect(() =>
      externalSnapshot(
        'mailbox',
        [{ total: null, unread: '0', complete: 'true' }],
        day,
      ),
    ).toThrow('Invalid')
    expect(() =>
      externalSnapshot(
        'mailbox',
        [{ total: '2', unread: '3', complete: 'true' }],
        day,
      ),
    ).toThrow('exceeds')
    expect(() =>
      externalSnapshot(
        'mailbox',
        Array(2).fill({ total: '2', unread: '1', complete: 'true' }),
        day,
      ),
    ).toThrow('one mailbox')
  })
})

describe('BigQuery aggregate transport', () => {
  const variables = [
    'FIREBASE_METRICS_VIEW',
    'METRICS_BIGQUERY_PROJECT',
    'METRICS_BIGQUERY_LOCATION',
    'METRICS_GOOGLE_CREDENTIALS',
  ]
  const original = Object.fromEntries(
    variables.map((name) => [name, process.env[name]]),
  )
  beforeEach(() => {
    process.env.FIREBASE_METRICS_VIEW = 'metrics-test.analytics.firebase'
    process.env.METRICS_BIGQUERY_PROJECT = 'metrics-test'
    process.env.METRICS_BIGQUERY_LOCATION = 'EU'
    delete process.env.METRICS_GOOGLE_CREDENTIALS
  })
  afterEach(() => {
    jest.restoreAllMocks()
    for (const name of variables) {
      if (original[name] === undefined) delete process.env[name]
      else process.env[name] = original[name]
    }
  })
  const response = (body: unknown) =>
    ({ ok: true, json: async () => body } as Response)

  it('binds the UTC day and bounds the query cost', async () => {
    const fetchMock = jest.spyOn(global, 'fetch').mockResolvedValue(
      response({
        jobComplete: true,
        schema: {
          fields: [
            { name: 'platform' },
            { name: 'received' },
            { name: 'opened' },
            { name: 'complete' },
          ],
        },
        rows: [
          { f: [{ v: 'android' }, { v: '4' }, { v: '1' }, { v: 'true' }] },
        ],
      }),
    )
    expect(await queryAggregates('firebase', new Date('2026-09-20'))).toEqual([
      { platform: 'android', received: '4', opened: '1', complete: 'true' },
    ])
    const request = JSON.parse(fetchMock.mock.calls[0][1]?.body as string)
    expect(request.query).toContain('WHERE day = @day')
    expect(request.queryParameters[0].parameterValue.value).toBe('2026-09-20')
    expect(request.maximumBytesBilled).toBe('1000000000')
  })

  it('rejects unsafe identifiers before contacting Google', async () => {
    const fetchMock = jest.spyOn(global, 'fetch')
    process.env.FIREBASE_METRICS_VIEW =
      'project.dataset.view`; DROP TABLE anything'
    await expect(queryAggregates('firebase', new Date())).rejects.toThrow(
      'configuration',
    )
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it.each([
    { jobComplete: false },
    { jobComplete: true, pageToken: 'more' },
    { jobComplete: true, errors: [{}] },
  ])('rejects incomplete results %j', async (body) => {
    jest.spyOn(global, 'fetch').mockResolvedValue(response(body))
    await expect(queryAggregates('firebase', new Date())).rejects.toThrow(
      'incomplete',
    )
  })
})
