import { QueryTypes, Sequelize } from 'sequelize'
import type { SnapshotMetric } from '@island.is/infra-metrics'

export const profileMetricsQuery = `
  SELECT CASE
    WHEN national_id ~ '^[0-9]{10}$' THEN
      CASE WHEN substring(national_id, 1, 2)::int BETWEEN 41 AND 71
        THEN 'company' ELSE 'individual' END
    ELSE 'other' END AS recipient_type,
    count(*) FILTER (WHERE document_notifications IS FALSE) AS disabled,
    count(*) FILTER (WHERE document_notifications IS NOT NULL) AS known,
    count(*) FILTER (WHERE document_notifications IS NULL) AS unknown
  FROM user_profile
  GROUP BY 1
`

export const collectProfileMetrics = async (
  db: Sequelize,
): Promise<SnapshotMetric[]> => {
  const rows = await db.query<{
    recipient_type: string
    disabled: string
    known: string
    unknown: string
  }>(profileMetricsQuery, { type: QueryTypes.SELECT })
  return ['individual', 'company', 'other'].flatMap((recipientType) => {
    const row = rows.find((row) => row.recipient_type === recipientType)
    const tags = { recipient_type: recipientType }
    return [
      { name: 'push.disabled_users', value: Number(row?.disabled ?? 0), tags },
      { name: 'push.known_users', value: Number(row?.known ?? 0), tags },
      { name: 'push.unknown_users', value: Number(row?.unknown ?? 0), tags },
    ]
  })
}
