import { applicationDefault, cert } from 'firebase-admin/app'
import {
  completedDay,
  publishSnapshot,
  SnapshotMetric,
} from '@island.is/infra-metrics'
import { logger } from '@island.is/logging'

type Source = 'firebase' | 'mailbox'
type AggregateRow = Record<string, string | null>
type QueryResult = {
  jobComplete?: boolean
  pageToken?: string
  errors?: unknown[]
  schema?: { fields: { name: string }[] }
  rows?: { f: { v: string | null }[] }[]
}

/** Read aggregate views only: source-specific raw schemas must be verified first. */
export const queryAggregates = async (
  source: Source,
  day: Date,
): Promise<AggregateRow[]> => {
  const prefix = source.toUpperCase()
  const view = process.env[`${prefix}_METRICS_VIEW`] ?? ''
  const project = process.env.METRICS_BIGQUERY_PROJECT ?? ''
  const location = process.env.METRICS_BIGQUERY_LOCATION
  if (
    !/^[a-z][a-z0-9-]*\.[A-Za-z_][A-Za-z0-9_]*\.[A-Za-z_][A-Za-z0-9_]*$/.test(
      view,
    ) ||
    !/^[a-z][a-z0-9-]*$/.test(project) ||
    !location
  ) {
    throw new Error(`Missing or invalid ${source} BigQuery configuration`)
  }
  const credentials = process.env.METRICS_GOOGLE_CREDENTIALS
  const credential = credentials
    ? cert(JSON.parse(credentials))
    : applicationDefault()
  const { access_token: accessToken } = await credential.getAccessToken()
  const columns =
    source === 'firebase'
      ? 'platform, received, opened, complete'
      : 'total, unread, complete'
  const response = await fetch(
    `https://bigquery.googleapis.com/bigquery/v2/projects/${project}/queries`,
    {
      method: 'POST',
      signal: AbortSignal.timeout(35000),
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `SELECT ${columns} FROM \`${view}\` WHERE day = @day`,
        useLegacySql: false,
        parameterMode: 'NAMED',
        queryParameters: [
          {
            name: 'day',
            parameterType: { type: 'DATE' },
            parameterValue: { value: day.toISOString().slice(0, 10) },
          },
        ],
        location,
        timeoutMs: 25000,
        // Views must be partition-pruned/pre-aggregated; do not scan the full export hourly.
        maximumBytesBilled: '1000000000',
        maxResults: 10,
      }),
    },
  )
  if (!response.ok)
    throw new Error(`BigQuery ${source} request failed (${response.status})`)
  const result = (await response.json()) as QueryResult
  if (
    !result.jobComplete ||
    result.pageToken ||
    result.errors?.length ||
    !result.schema
  ) {
    throw new Error(`BigQuery ${source} returned incomplete results`)
  }
  const fields = result.schema.fields
  return (result.rows ?? []).map((row) =>
    Object.fromEntries(
      fields.map((field, index) => [field.name, row.f[index]?.v ?? null]),
    ),
  )
}

const count = (value: string | null | undefined) => {
  if (
    value == null ||
    !/^\d+$/.test(value) ||
    !Number.isSafeInteger(Number(value))
  ) {
    throw new Error('Invalid external aggregate count')
  }
  return Number(value)
}

export const externalSnapshot = (
  source: Source,
  rows: AggregateRow[],
  day: Date,
): SnapshotMetric[] => {
  if (!rows.length || rows.some((row) => row.complete !== 'true')) {
    // Missing/late data is not a zero. Do not refresh the data-period gauge.
    return [{ name: 'external.available', value: 0 }]
  }
  const metrics: SnapshotMetric[] = [{ name: 'external.available', value: 1 }]
  const platforms = new Set<string>()
  for (const row of rows) {
    if (source === 'firebase') {
      const platform = row.platform ?? ''
      if (!['android', 'ios'].includes(platform) || platforms.has(platform)) {
        throw new Error(
          'Expected one Firebase aggregate per supported platform',
        )
      }
      platforms.add(platform)
      const received = count(row.received)
      const opened = count(row.opened)
      if (opened > received)
        throw new Error('Firebase opens exceed matched receipts')
      metrics.push(
        { name: 'push.received', value: received, tags: { platform } },
        { name: 'push.opened', value: opened, tags: { platform } },
      )
    } else {
      if (rows.length !== 1) throw new Error('Expected one mailbox aggregate')
      const total = count(row.total)
      const unread = count(row.unread)
      if (unread > total)
        throw new Error('Mailbox unread count exceeds cohort size')
      metrics.push(
        { name: 'unread_7d.total', value: total, tags: { kind: 'document' } },
        { name: 'unread_7d.unread', value: unread, tags: { kind: 'document' } },
      )
    }
  }
  metrics.push({ name: 'external.period_start', value: day.getTime() / 1000 })
  return metrics
}

export const externalMetrics = async () => {
  const sourceArg = process.argv
    .find((arg) => arg.startsWith('--source='))
    ?.split('=')[1]
  if (sourceArg !== 'firebase' && sourceArg !== 'mailbox')
    throw new Error('Specify --source=firebase or --source=mailbox')
  const source = sourceArg
  await publishSnapshot(source, async () => {
    if (process.env[`${source.toUpperCase()}_METRICS_ENABLED`] !== 'true') {
      return [
        { name: 'external.enabled', value: 0 },
        { name: 'external.available', value: 0 },
      ]
    }
    // Mailbox cohorts must have reached 7 days; Firebase waits for export latency.
    const day = completedDay(new Date(), source === 'mailbox' ? 8 : 3).start
    try {
      return [
        { name: 'external.enabled', value: 1 },
        ...externalSnapshot(source, await queryAggregates(source, day), day),
      ]
    } catch (error) {
      logger.error('External notification metrics collection failed', {
        source,
      })
      throw error
    }
  })
}
