import { Sequelize } from 'sequelize'

import { EventType } from '@island.is/judicial-system/types'

export const buildSubpoenaExistsCondition = (exists = true) =>
  Sequelize.literal(`
    ${exists ? '' : 'NOT'} EXISTS (
      SELECT 1
      FROM subpoena
      WHERE subpoena.case_id = "Case".id
    )
  `)

export const buildEventLogExistsCondition = (
  eventType: EventType,
  exists = true,
) =>
  Sequelize.literal(`
     ${exists ? '' : 'NOT'} EXISTS (
        SELECT 1
        FROM event_log
        WHERE event_log.case_id = "Case".id
          AND event_log.event_type = '${eventType}'
      )
    `)
