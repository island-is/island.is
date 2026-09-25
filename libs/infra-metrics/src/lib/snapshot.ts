import { DogStatsD } from './dogStatsD'

export interface SnapshotMetric {
  name: string
  value: number
  tags?: Record<string, string>
}

/** UTC calendar days, deliberately independent of the host's timezone. */
export const completedDay = (now: Date, daysAgo = 1) => {
  const end = new Date(now)
  end.setUTCHours(0, 0, 0, 0)
  end.setUTCDate(end.getUTCDate() - daysAgo + 1)
  return { start: new Date(end.getTime() - 86400000), end }
}

/** Gauges are snapshots: rerunning a job must not increment yesterday's totals. */
export const publishSnapshot = async (
  source: string,
  collect: () => Promise<SnapshotMetric[]>,
  client = new DogStatsD({
    prefix: 'notifications.analytics.',
    globalTags: { source },
    maxBufferSize: 0,
  }),
) => {
  const started = Date.now()
  const gauge = (metric: SnapshotMetric) =>
    new Promise<void>((resolve, reject) => {
      client.gauge(
        metric.name,
        metric.value,
        { source, ...metric.tags },
        (err) => (err ? reject(err) : resolve()),
      )
    })
  try {
    const metrics = await collect()
    for (const metric of metrics) {
      if (!Number.isFinite(metric.value)) {
        throw new Error(`Invalid snapshot metric: ${metric.name}`)
      }
    }
    for (const metric of metrics) await gauge(metric)
    await gauge({ name: 'collection.duration_ms', value: Date.now() - started })
    await gauge({ name: 'collection.success', value: 1 })
    await gauge({ name: 'collection.last_success', value: Date.now() / 1000 })
  } catch (error) {
    await gauge({ name: 'collection.success', value: 0 })
    throw error
  } finally {
    await new Promise<void>((resolve, reject) => {
      client.close((err) => (err ? reject(err) : resolve()))
    })
  }
}
