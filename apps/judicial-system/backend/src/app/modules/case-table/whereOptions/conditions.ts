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

export const buildHasDefendantSentToPrisonAdminNotRegisteredCondition = () =>
  Sequelize.literal(`
    EXISTS (
      SELECT 1
      FROM defendant d
      INNER JOIN "case" c ON c.id = d.case_id
      WHERE d.case_id = "Case".id
        AND d.is_sent_to_prison_admin = true
        AND d.indictment_review_decision = '${IndictmentCaseReviewDecision.ACCEPT}'
        AND (
          d.is_registered_in_prison_system IS NOT TRUE
          OR (
            d.is_registered_in_prison_system IS NULL
            AND c.is_registered_in_prison_system IS NOT TRUE
          )
        )
    )
  `)

export const buildHasDefendantSentToPrisonAdminRegisteredCondition = () =>
  Sequelize.literal(`
    EXISTS (
      SELECT 1
      FROM defendant d
      INNER JOIN "case" c ON c.id = d.case_id
      WHERE d.case_id = "Case".id
        AND d.is_sent_to_prison_admin = true
        AND d.indictment_review_decision = '${IndictmentCaseReviewDecision.ACCEPT}'
        AND (
          d.is_registered_in_prison_system = true
          OR (
            d.is_registered_in_prison_system IS NULL
            AND c.is_registered_in_prison_system = true
          )
        )
    )
  `)
