import { QueryTypes, Sequelize } from 'sequelize'
import { completedDay, SnapshotMetric } from '@island.is/infra-metrics'

export const deliveryMetricsQuery = `
  SELECT d.channel, count(*) AS total
  FROM notification_delivery d
  JOIN user_notification n ON n.id = d.user_notification_id
  WHERE d.created >= :start AND d.created < :end
    AND CASE WHEN n.recipient ~ '^[0-9]{10}$'
      THEN substring(n.recipient, 1, 2)::int BETWEEN 41 AND 71
      ELSE FALSE END
  GROUP BY d.channel
`

export const unreadMetricsQuery = `
  SELECT count(*) AS total,
    count(*) FILTER (WHERE read_at IS NULL OR read_at > created + interval '7 days') AS unread
  FROM user_notification
  WHERE created >= :start AND created < :end
`

export const collectNotificationMetrics = async (
  db: Sequelize,
  now = new Date(),
): Promise<SnapshotMetric[]> => {
  const day = completedDay(now)
  const rows = await db.query<{ channel: string; total: string }>(
    deliveryMetricsQuery,
    {
      replacements: day,
      type: QueryTypes.SELECT,
    },
  )
  const metrics: SnapshotMetric[] = ['push', 'email', 'sms'].map((channel) => ({
    name: 'company.deliveries_previous_day',
    value: Number(rows.find((row) => row.channel === channel)?.total ?? 0),
    tags: { channel, recipient_type: 'company' },
  }))
  metrics.push({ name: 'company.period_end', value: day.end.getTime() / 1000 })

  // Only whole cohorts created after read tracking was enabled are trustworthy.
  const [coverage] = await db.query<{ started_at: Date | null }>(
    'SELECT started_at FROM notification_metrics_coverage WHERE id = 1',
    { type: QueryTypes.SELECT },
  )
  const cohort = completedDay(now, 8)
  const ready =
    !!coverage?.started_at && cohort.start >= new Date(coverage.started_at)
  metrics.push({
    name: 'unread_7d.available',
    value: ready ? 1 : 0,
    tags: { kind: 'notification' },
  })
  if (ready) {
    const [row] = await db.query<{ total: string; unread: string }>(
      unreadMetricsQuery,
      {
        replacements: cohort,
        type: QueryTypes.SELECT,
      },
    )
    metrics.push(
      {
        name: 'unread_7d.total',
        value: Number(row.total),
        tags: { kind: 'notification' },
      },
      {
        name: 'unread_7d.unread',
        value: Number(row.unread),
        tags: { kind: 'notification' },
      },
      {
        name: 'unread_7d.cohort_end',
        value: cohort.end.getTime() / 1000,
        tags: { kind: 'notification' },
      },
    )
  }
  return metrics
}
