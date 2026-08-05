import { Sequelize } from 'sequelize-typescript'

import {
  DefendantEventType,
  EventType,
  IndictmentCaseReviewDecision,
} from '@island.is/judicial-system/types'

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
        AND defendant.is_alternative_service = TRUE
    )
  `)

export const buildIsSentToPrisonAdminExistsCondition = (exists: boolean) =>
  Sequelize.literal(`
    ${exists ? '' : 'NOT'} EXISTS (
      SELECT 1
      FROM defendant
      WHERE defendant.case_id = "Case".id
        AND defendant.is_sent_to_prison_admin = TRUE
        AND defendant.indictment_review_decision = '${
          IndictmentCaseReviewDecision.ACCEPT
        }'
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

export const buildEventLogOrderCondition = (
  eventType1: EventType,
  eventType2: EventType,
  exists: boolean,
) =>
  Sequelize.literal(`
    ${exists ? '' : 'NOT'} EXISTS (
      SELECT 1
      WHERE (
        SELECT MAX(created)
        FROM event_log
        WHERE event_log.case_id = "Case".id
          AND event_log.event_type = '${eventType1}'
      ) < (
        SELECT MAX(created)
        FROM event_log
        WHERE event_log.case_id = "Case".id
          AND event_log.event_type = '${eventType2}'
      )
    )
  `)

export const buildHasDefendantWithNullReviewDecisionCondition = (
  exists: boolean,
) =>
  Sequelize.literal(`
    ${exists ? '' : 'NOT'} EXISTS (
      SELECT 1
      FROM defendant
      WHERE defendant.case_id = "Case".id
        AND defendant.indictment_review_decision IS NULL
        -- Defendants whose indictment was cancelled or dismissed (completed for
        -- some) never receive a review decision, so they must not keep a case
        -- in review.
        AND NOT EXISTS (
          SELECT 1
          FROM defendant_event_log
          WHERE defendant_event_log.defendant_id = defendant.id
            AND defendant_event_log.event_type IN (
              '${DefendantEventType.INDICTMENT_CANCELLED}',
              '${DefendantEventType.INDICTMENT_DISMISSED}'
            )
        )
    )
  `)
