import { Sequelize } from 'sequelize-typescript'

import {
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
        AND defendant.is_alternative_service = true
    )
  `)

export const buildIsSentToPrisonExistsCondition = (exists: boolean) =>
  Sequelize.literal(`
    ${exists ? '' : 'NOT'} EXISTS (
      SELECT 1
      FROM defendant
      WHERE defendant.case_id = "Case".id
        AND defendant.is_sent_to_prison_admin = true
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
    )
  `)

export const buildAllDefendantsHaveReviewDecisionCondition = (
  decision: IndictmentCaseReviewDecision,
) =>
  Sequelize.literal(`
    NOT EXISTS (
      SELECT 1
      FROM defendant
      WHERE defendant.case_id = "Case".id
        AND defendant.indictment_review_decision != '${decision}'
    )
  `)
