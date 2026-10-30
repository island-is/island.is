'use strict'

// Records where an APPEALED event came from: the court record (IN_COURT) or a
// party filing directly within the appeal deadline (OUT_OF_COURT).
//
// Why this cannot be derived. An in-court appeal is identified by a
// decision = APPEAL row on appeal_decision, but an out-of-court appellant has no
// such row - they appealed precisely because they postponed in court. So "this
// side has no APPEAL row" cannot distinguish an out-of-court appellant from an
// in-court one whose decision was corrected away, and correction reconciliation
// has to treat those opposites: preserve the first, discard the second. Without
// a recorded origin it discarded both, deleting real out-of-court appeals (and
// the briefs and statements filed for them) when a completed case was reopened,
// corrected and re-completed.
//
// Backfill derives the origin from the decision rows, which is correct for
// history because a correction that would have made the derivation wrong is the
// very thing that used to delete the appeal - so no surviving appeal can be in
// that state. It reads only appeal_decision / appeal_case / appeal_event_log,
// never the legacy case columns, so it is unaffected by whether the columns have
// been dropped yet and imposes no ordering against those drops.
//
// The second backfill statement classifies every APPEALED event the first one
// did not, so none are left unset and the check constraint added at the end can
// require an origin on all of them.

// Stored as a plain string, not a Postgres enum - the values are validated in
// the model (DataType.ENUM over AppealOrigin) and adding a value to a DB enum
// needs its own migration. Matches appeal_decision.party_role / .decision.
const PROSECUTION_ROLES = `('PROSECUTOR', 'PROSECUTOR_REPRESENTATIVE')`

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.addColumn(
        'appeal_event_log',
        'appeal_origin',
        {
          type: Sequelize.STRING,
          allowNull: true,
        },
        { transaction },
      )

      // An APPEALED event is in-court when the party it belongs to has an
      // APPEAL decision on the same ruling. The ruling comes from the event's
      // appeal case (null for case-level appeals), and the party is matched on
      // side plus the defendant / civil claimant ids - both null for the
      // collective request-case defence, which IS NOT DISTINCT FROM matches.
      await queryInterface.sequelize.query(
        `
        UPDATE appeal_event_log e
        SET appeal_origin = 'IN_COURT'
        FROM appeal_case ac
        WHERE e.appeal_case_id = ac.id
          AND e.event_type = 'APPEALED'
          AND EXISTS (
            SELECT 1 FROM appeal_decision ad
            WHERE ad.case_id = e.case_id
              AND ad.ruling_file_id IS NOT DISTINCT FROM ac.ruling_file_id
              AND ad.decision = 'APPEAL'
              AND ad.defendant_id IS NOT DISTINCT FROM e.defendant_id
              AND ad.civil_claimant_id IS NOT DISTINCT FROM e.civil_claimant_id
              AND CASE
                    WHEN e.user_role IN ${PROSECUTION_ROLES}
                      THEN ad.party_role = 'PROSECUTOR'
                    ELSE ad.party_role IN ('DEFENDANT', 'CIVIL_CLAIMANT')
                  END
          )
        `,
        { transaction },
      )

      // Every remaining APPEALED event was filed out of court. Other event types
      // keep a null origin - it means nothing for them.
      await queryInterface.sequelize.query(
        `
        UPDATE appeal_event_log
        SET appeal_origin = 'OUT_OF_COURT'
        WHERE event_type = 'APPEALED'
          AND appeal_origin IS NULL
        `,
        { transaction },
      )

      // Pin the invariant now that every row satisfies it: an origin is present
      // exactly on APPEALED events. This is the reason the column is nullable
      // rather than NOT NULL - the other event types must have no origin - and it
      // is stronger than NOT NULL would be, because it constrains both
      // directions. It also means the null-is-out-of-court fallback in the
      // service code can never be reached by a new row, so a future
      // appeal-creation path cannot quietly omit the origin and have its appeals
      // silently treated as out-of-court.
      await queryInterface.sequelize.query(
        `
        ALTER TABLE appeal_event_log
          ADD CONSTRAINT appeal_event_log_appeal_origin_check CHECK (
            (event_type = 'APPEALED' AND appeal_origin IS NOT NULL) OR
            (event_type <> 'APPEALED' AND appeal_origin IS NULL)
          )
        `,
        { transaction },
      )
    })
  },

  down: async (queryInterface) => {
    await queryInterface.sequelize.transaction(async (transaction) => {
      // Dropping the column would take the constraint with it, but be explicit.
      await queryInterface.sequelize.query(
        `
        ALTER TABLE appeal_event_log
          DROP CONSTRAINT IF EXISTS appeal_event_log_appeal_origin_check
        `,
        { transaction },
      )

      await queryInterface.removeColumn('appeal_event_log', 'appeal_origin', {
        transaction,
      })
    })
  },
}
