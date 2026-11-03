import { QueryTypes, Sequelize } from 'sequelize'
import type { SnapshotMetric } from './snapshot'

export const profileMetricsQuery = `
  SELECT COUNT(*) FILTER (
    WHERE document_notifications IS NOT TRUE
      AND email_notifications IS NOT TRUE
      AND sms_notifications IS NOT TRUE
  ) AS all_channels_disabled
  FROM user_profile
`

export const collectProfileMetrics = async (
  db: Sequelize,
): Promise<SnapshotMetric[]> => {
  const [row] = await db.query<{ all_channels_disabled: string }>(
    profileMetricsQuery,
    { type: QueryTypes.SELECT },
  )

  return [
    {
      name: 'all_channels_disabled_users',
      value: Number(row?.all_channels_disabled ?? 0),
    },
  ]
}
