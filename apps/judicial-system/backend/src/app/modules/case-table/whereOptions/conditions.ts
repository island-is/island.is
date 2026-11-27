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

// The verdict appeal on this case has had an appeal summons sent to the court
// of appeals. That is what opens a verdict appeal to the court: until then the
// appeal is still being prepared by the public prosecution. A sent summons can
// be neither unsent nor deleted, so once true this stays true.
//
// canAppealsCourtUserAccessCaseVerdictAppealCase in case.filter.ts is the same
// rule for opening a case; keep the two in step.
//
// Correlated to "Case".id through the appeal, so no join is needed and the
// predicate survives the subSELECT that a LIMIT forces.
export const buildHasSentAppealSummonsCondition = () =>
  Sequelize.literal(`
    EXISTS (
      SELECT 1
      FROM "appeal_summons" s
      JOIN "appeal_case" ac ON ac."id" = s."appeal_case_id"
      WHERE ac."case_id" = "Case"."id"
        AND ac."appeal_type" = 'VERDICT'
        AND s."sent_to_court_of_appeals_date" IS NOT NULL
    )
  `)

// A verdict on this case has been appealed - by the defence, which the office
// records as an appeal date on the verdict, or by the prosecution, whose
// reviewer recorded a decision to appeal.
//
// A defendant closed without enforcement still counts, unlike in the public
// prosecution office's lists. Closing does not touch the appeal - it writes a
// defendant event and nothing else - so an appeal can be standing at the court
// of appeals against a judgment the office has decided not to enforce, and the
// prosecutor arguing it must not lose the case.
//
// Correlated to "Case".id rather than expressed as a where on a defendants
// include, because setInclude merges only attributes: an include-level where
// would also narrow the defendants column to the appealing defendants, and the
// EXISTS form survives the subSELECT that a LIMIT forces.
//
// On the defence side only the latest verdict counts: a defendant may be given a
// new one, and the previous verdict's appeal date says nothing about where the
// case stands now. The prosecution's side carries no such qualifier - a review
// decision to appeal stands whatever verdicts follow.
export const buildHasAppealedVerdictCondition = () =>
  Sequelize.literal(`
    EXISTS (
      SELECT 1
      FROM defendant
      WHERE defendant.case_id = "Case".id
        AND (
          defendant.indictment_review_decision = '${IndictmentCaseReviewDecision.APPEAL}'
          OR EXISTS (
            SELECT 1
            FROM verdict
            WHERE verdict.defendant_id = defendant.id
              AND verdict.appeal_date IS NOT NULL
              AND verdict.created = (
                SELECT MAX(v2.created)
                FROM verdict v2
                WHERE v2.defendant_id = defendant.id
              )
          )
        )
    )
  `)

// National ids are embedded in raw SQL literals, so reduce them to digits only
// to rule out SQL injection. National ids are stored dash-free in the
// database, so this also normalizes the comparison value.
export const sanitizeNationalId = (nationalId?: string): string =>
  nationalId?.replace(/\D/g, '') ?? ''

// The person with this national id holds the case at the court of appeals:
// confirmed there as the appeal defender of a defendant or the appeal
// spokesperson of a civil claimant. One of the ways into the defence access
// options, and the membership rule of the defence list of appealed verdicts -
// shared so the two cannot drift apart.
//
// Correlated to "Case".id rather than expressed as a where on a defendants
// include, so the predicate survives the subSELECT that a LIMIT forces and
// leaves the defendants a list shows unfiltered.
export const buildIsConfirmedVerdictAppealAdvocateCondition = (
  nationalId?: string,
) => {
  const sanitizedNationalId = sanitizeNationalId(nationalId)

  return Sequelize.literal(`
    (
      EXISTS (
        SELECT 1
        FROM defendant
        WHERE defendant.case_id = "Case".id
          AND defendant.appeal_defender_national_id = '${sanitizedNationalId}'
          AND defendant.is_appeal_defender_confirmed = true
          AND defendant.is_appeal_defender_waived IS DISTINCT FROM true
      )
      OR EXISTS (
        SELECT 1
        FROM civil_claimant
        WHERE civil_claimant.case_id = "Case".id
          AND civil_claimant.appeal_spokesperson_national_id = '${sanitizedNationalId}'
          AND civil_claimant.is_appeal_spokesperson_confirmed = true
          AND civil_claimant.has_appeal_spokesperson IS DISTINCT FROM false
      )
    )
  `)
}
