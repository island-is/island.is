import { Sequelize } from 'sequelize'

import { EventType } from '@island.is/judicial-system/types'

export const buildSubpoenaExistsCondition = (exists: boolean) =>
  Sequelize.literal(`
        ${exists ? '' : 'NOT'} EXISTS (
          SELECT 1
          FROM subpoena
          WHERE subpoena.case_id = "Case".id
        )
      `)

export const buildAlternativeServiceExistsCondition = (exists: boolean) =>
  Sequelize.literal(`
        ${exists ? '' : 'NOT'} EXISTS (
          SELECT 1
          FROM defendant
          WHERE defendant.case_id = "Case".id
            AND defendant.is_alternative_service = true
        )
      `)

export const buildEventLogExistsCondition = (
  eventType: EventType,
  exists: boolean,
) =>
  Sequelize.literal(`
         ${exists ? '' : 'NOT'} EXISTS (
            SELECT 1
            FROM event_log
            WHERE event_log.case_id = "Case".id
              AND event_log.event_type = '${eventType}'
          )
        `)
