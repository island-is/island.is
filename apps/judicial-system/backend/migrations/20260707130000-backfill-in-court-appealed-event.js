'use strict'

// Corrects the coverage of 20260701120000-backfill-appealed-event.js, which had
// already been applied (main 2026-07-03) when two gaps in its predicates were
// found. An applied migration cannot be re-run, so the remainder is backfilled
// here instead. Both statements below reuse that migration's exact attribution
// rules - this only widens WHICH appeals are covered, never how a covered
// appeal is attributed.
//
// Gap 1 - case-level appeals made IN COURT. The original keyed the case-level
// queries on `<side>_postponed_appeal_date IS NOT NULL`, which is the
// out-of-court signal: it is NULL when the appeal was made in court, where the
// stance lives in `<side>_appeal_decision = 'APPEAL'` instead. Those appeals
// therefore got no APPEALED event. That matters because the withdrawal guard
// (userIsAppellant / canWithdrawCaseLevelAppeal) and the case-table display
// gate (canCancelAppeal) both read the event log, so an appeal with no event is
// un-withdrawable - and the display falls back to the legacy columns, so
// nothing looks wrong on screen. Prosecutor precedence and the ACCEPT void are
// unchanged, and request-case defence stays collective (no party attached).
//
// Gap 2 - in-court ruling-order appeals whose APPEAL decisions had all been
// withdrawn. The original's in-court branch filtered `withdrawn_date IS NULL`,
// but the semantics were later revised: an APPEALED event records a real fact,
// so it is KEPT when a party withdraws (the withdrawal is recorded separately
// by APPEAL_WITHDRAWN) and removed only when the decision is no longer APPEAL.
// A party that had already withdrawn when the original ran was skipped. These
// appeals are closed, so withdrawal is moot; the exposure is defence
// appeal-FILE visibility, which keys on the same event.
//
// NOTE the deliberate difference in guards. Statements 1 and 2 guard on the
// appeal case having NO APPEALED event, exactly as the original did: a
// case-level appeal is collective with prosecutor precedence, so one event per
// appeal case is the intended representation and a second must not be added.
// Statement 3 guards PER PARTY, because a ruling-order appeal is per-party and
// a mixed appeal (one party standing, one withdrawn) already has an event for
// the standing party - the appeal-case guard would block the withdrawn party's
// event and leave it half-covered.
//
// Idempotent: both guards make a re-run a no-op. `created` is set to the appeal
// date so each event records when the appeal actually happened. Actor snapshots
// are left null - the historical actor is unknown. `down` is a no-op for the
// same reason as the original: backfilled rows are indistinguishable from
// dual-write events on rollback, so history is left intact.

// No APPEALED event at all for this appeal case.
const APPEAL_CASE_GUARD = `
  NOT EXISTS (
    SELECT 1 FROM appeal_event_log e
    WHERE e.appeal_case_id = ac.id AND e.event_type = 'APPEALED'
  )
`

// No APPEALED event for this specific party of this appeal case. Prosecutor
// decision rows carry both party ids NULL, and so do the events written for
// them, so IS NOT DISTINCT FROM matches them correctly.
const APPEAL_PARTY_GUARD = `
  NOT EXISTS (
    SELECT 1 FROM appeal_event_log e
    WHERE e.appeal_case_id = ac.id
      AND e.event_type = 'APPEALED'
      AND e.defendant_id IS NOT DISTINCT FROM ad.defendant_id
      AND e.civil_claimant_id IS NOT DISTINCT FROM ad.civil_claimant_id
  )
`

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.sequelize.transaction(async (transaction) => {
      // 1. Case-level appeals attributed to the prosecutor, where the stance
      // was recorded in court (no postponed date).
      await queryInterface.sequelize.query(
        `
        INSERT INTO appeal_event_log (id, created, case_id, appeal_case_id, event_type, user_role)
        SELECT gen_random_uuid(), ac.appeal_date, ac.case_id, ac.id, 'APPEALED', 'PROSECUTOR'
        FROM appeal_case ac
        JOIN "case" c ON c.id = ac.case_id
        WHERE ac.ruling_file_id IS NULL
          AND c.prosecutor_appeal_decision = 'APPEAL'
          AND ${APPEAL_CASE_GUARD}
        `,
        { transaction },
      )

      // 2. Case-level appeals attributed to the defence, only where the
      // prosecutor branch did not apply - prosecutor takes precedence. The
      // prosecutor test mirrors the original migration's (postponed date OR
      // in-court APPEAL, voided by an ACCEPT) so precedence is decided the same
      // way here as it was there.
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
          AND c.accused_appeal_decision = 'APPEAL'
          AND ${APPEAL_CASE_GUARD}
        `,
        { transaction },
      )

      // 3. In-court ruling-order appeals - one event per APPEAL decision
      // regardless of withdrawal, side and party taken from the decision row.
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
          AND ${APPEAL_PARTY_GUARD}
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
