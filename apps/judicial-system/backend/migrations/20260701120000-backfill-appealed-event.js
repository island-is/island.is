'use strict'

// Backfill APPEALED events so every existing appeal case records its appellant
// in the event log - the single source the appellant is now read from (Phase 3).
// Going forward the appellant is written when the appeal is made: out-of-court by
// registerAppellant, in-court by the session-confirmation dual-write. This fills
// in the history.
//
// The appellant's side is reproduced exactly from the same legacy sources the
// read still falls back to, so no appeal changes how it is displayed:
//   1. Case-level appeals (request cases, no ruling file) - a side appealed if
//      its postponed-appeal date is set (appealed out of court) or its in-court
//      decision is APPEAL (appealed in court, where the postponed date is not
//      set); prosecutor first, voided by an in-court ACCEPT. Request defence is
//      collective, so no party is attached.
//   2. Out-of-court ruling-order appeals (a ruling file, no in-court APPEAL
//      decision) - DEFENDER when appealed_by_national_id is set, else PROSECUTOR.
//      The defence party (defendant / civil claimant) is resolved from that
//      national id when it maps unambiguously to a single confirmed
//      representative; left null otherwise (side still displays correctly, and
//      the party is only needed once authorization moves onto the event log).
//   3. In-court ruling-order appeals - one event per standing (not withdrawn)
//      APPEAL decision, side and party taken straight from the decision row.
//
// created is set to the appeal date so each backfilled event records when the
// appeal actually happened (dual-write events carry their own insertion
// instant). Actor snapshots are left null - the historical actor is unknown -
// except the appellant national id for out-of-court defence appeals, where the
// actor is the appellant. The down migration is a no-op: these rows are
// indistinguishable from dual-write events on rollback, so history is left
// intact.

const APPEALED_GUARD = `
  NOT EXISTS (
    SELECT 1 FROM appeal_event_log e
    WHERE e.appeal_case_id = ac.id AND e.event_type = 'APPEALED'
  )
`

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.sequelize.transaction(async (transaction) => {
      // 1. Case-level appeals attributed to the prosecutor.
      await queryInterface.sequelize.query(
        `
        INSERT INTO appeal_event_log (id, created, case_id, appeal_case_id, event_type, user_role)
        SELECT gen_random_uuid(), ac.appeal_date, ac.case_id, ac.id, 'APPEALED', 'PROSECUTOR'
        FROM appeal_case ac
        JOIN "case" c ON c.id = ac.case_id
        WHERE ac.ruling_file_id IS NULL
          AND (
            c.prosecutor_postponed_appeal_date IS NOT NULL
            OR c.prosecutor_appeal_decision = 'APPEAL'
          )
          AND c.prosecutor_appeal_decision IS DISTINCT FROM 'ACCEPT'
          AND ${APPEALED_GUARD}
        `,
        { transaction },
      )

      // 1. Case-level appeals attributed to the defence (only where the
      // prosecutor branch did not apply - prosecutor takes precedence).
      await queryInterface.sequelize.query(
        `
        INSERT INTO appeal_event_log (id, created, case_id, appeal_case_id, event_type, user_role)
        SELECT gen_random_uuid(), ac.appeal_date, ac.case_id, ac.id, 'APPEALED', 'DEFENDER'
        FROM appeal_case ac
        JOIN "case" c ON c.id = ac.case_id
        WHERE ac.ruling_file_id IS NULL
          AND NOT (
            (
              c.prosecutor_postponed_appeal_date IS NOT NULL
              OR c.prosecutor_appeal_decision = 'APPEAL'
            )
            AND c.prosecutor_appeal_decision IS DISTINCT FROM 'ACCEPT'
          )
          AND (
            c.accused_postponed_appeal_date IS NOT NULL
            OR c.accused_appeal_decision = 'APPEAL'
          )
          AND c.accused_appeal_decision IS DISTINCT FROM 'ACCEPT'
          AND ${APPEALED_GUARD}
        `,
        { transaction },
      )

      // 2. Out-of-court ruling-order appeals (no in-court APPEAL decision).
      await queryInterface.sequelize.query(
        `
        INSERT INTO appeal_event_log (
          id, created, case_id, appeal_case_id, event_type, user_role,
          defendant_id, civil_claimant_id, national_id
        )
        SELECT gen_random_uuid(), ac.appeal_date, ac.case_id, ac.id, 'APPEALED',
          CASE WHEN ac.appealed_by_national_id IS NULL THEN 'PROSECUTOR' ELSE 'DEFENDER' END,
          -- Resolve the party only when the national id maps to a single
          -- confirmed representative across both tables combined. A match in
          -- one table plus any match in the other is ambiguous - leave both null.
          CASE WHEN (
              SELECT count(*) FROM defendant d
              WHERE d.case_id = ac.case_id AND d.is_defender_choice_confirmed
                AND d.defender_national_id = ac.appealed_by_national_id
            ) = 1
            AND (
              SELECT count(*) FROM civil_claimant cc
              WHERE cc.case_id = ac.case_id AND cc.is_spokesperson_confirmed
                AND cc.spokesperson_national_id = ac.appealed_by_national_id
            ) = 0
            THEN (
              SELECT d.id FROM defendant d
              WHERE d.case_id = ac.case_id AND d.is_defender_choice_confirmed
                AND d.defender_national_id = ac.appealed_by_national_id
              LIMIT 1
            )
            ELSE NULL END,
          CASE WHEN (
              SELECT count(*) FROM civil_claimant cc
              WHERE cc.case_id = ac.case_id AND cc.is_spokesperson_confirmed
                AND cc.spokesperson_national_id = ac.appealed_by_national_id
            ) = 1
            AND (
              SELECT count(*) FROM defendant d
              WHERE d.case_id = ac.case_id AND d.is_defender_choice_confirmed
                AND d.defender_national_id = ac.appealed_by_national_id
            ) = 0
            THEN (
              SELECT cc.id FROM civil_claimant cc
              WHERE cc.case_id = ac.case_id AND cc.is_spokesperson_confirmed
                AND cc.spokesperson_national_id = ac.appealed_by_national_id
              LIMIT 1
            )
            ELSE NULL END,
          ac.appealed_by_national_id
        FROM appeal_case ac
        WHERE ac.ruling_file_id IS NOT NULL
          AND NOT EXISTS (
            SELECT 1 FROM appeal_decision ad
            WHERE ad.case_id = ac.case_id AND ad.ruling_file_id = ac.ruling_file_id
              AND ad.decision = 'APPEAL'
          )
          AND ${APPEALED_GUARD}
        `,
        { transaction },
      )

      // 3. In-court ruling-order appeals - one event per standing APPEAL
      // decision, side and party taken from the decision row.
      await queryInterface.sequelize.query(
        `
        INSERT INTO appeal_event_log (
          id, created, case_id, appeal_case_id, event_type, user_role,
          defendant_id, civil_claimant_id
        )
        SELECT gen_random_uuid(), ac.appeal_date, ac.case_id, ac.id, 'APPEALED',
          CASE WHEN ad.party_role = 'PROSECUTOR' THEN 'PROSECUTOR' ELSE 'DEFENDER' END,
          ad.defendant_id, ad.civil_claimant_id
        FROM appeal_case ac
        JOIN appeal_decision ad
          ON ad.case_id = ac.case_id AND ad.ruling_file_id = ac.ruling_file_id
        WHERE ac.ruling_file_id IS NOT NULL
          AND ad.decision = 'APPEAL'
          AND ad.withdrawn_date IS NULL
          AND ${APPEALED_GUARD}
        `,
        { transaction },
      )
    })
  },

  down: async () => {
    // Data-fix/backfill migrations are intentionally not reversed - the
    // backfilled rows are indistinguishable from dual-write events on rollback,
    // so leave historical data intact.
    return Promise.resolve()
  },
}
