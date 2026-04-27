'use strict'

// Backfill the appeal_event_log table from the legacy
// appeal_case.prosecutor_statement_date and appeal_case.defendant_statement_date
// columns. Historical per-party identity cannot be reconstructed — the legacy
// columns aggregate across all parties — so backfilled rows have no
// defendant_id / civil_claimant_id. New statement sends (Phase 2 dual-write)
// carry those ids and are unaffected by this migration.
module.exports = {
  up: (queryInterface) => {
    return queryInterface.sequelize.transaction((transaction) =>
      queryInterface.sequelize
        .query(
          `
          INSERT INTO appeal_event_log (
            id,
            created,
            case_id,
            appeal_case_id,
            event_type,
            user_role
          )
          SELECT
            gen_random_uuid(),
            prosecutor_statement_date,
            case_id,
            id,
            'APPEAL_STATEMENT_SENT',
            'PROSECUTOR'
          FROM appeal_case
          WHERE prosecutor_statement_date IS NOT NULL
          `,
          { transaction },
        )
        .then(() =>
          queryInterface.sequelize.query(
            `
            INSERT INTO appeal_event_log (
              id,
              created,
              case_id,
              appeal_case_id,
              event_type,
              user_role
            )
            SELECT
              gen_random_uuid(),
              defendant_statement_date,
              case_id,
              id,
              'APPEAL_STATEMENT_SENT',
              'DEFENDER'
            FROM appeal_case
            WHERE defendant_statement_date IS NOT NULL
            `,
            { transaction },
          ),
        ),
    )
  },

  down: (queryInterface) => {
    // Delete only rows whose (appeal_case_id, role, created) matches the
    // originating legacy date column exactly — leaves any Phase 2 dual-write
    // rows untouched.
    return queryInterface.sequelize.transaction((transaction) =>
      queryInterface.sequelize
        .query(
          `
          DELETE FROM appeal_event_log eventLog
          USING appeal_case appealCase
          WHERE eventLog.appeal_case_id = appealCase.id
            AND eventLog.event_type = 'APPEAL_STATEMENT_SENT'
            AND eventLog.user_role = 'PROSECUTOR'
            AND eventLog.created = appealCase.prosecutor_statement_date
            AND eventLog.defendant_id IS NULL
            AND eventLog.civil_claimant_id IS NULL
          `,
          { transaction },
        )
        .then(() =>
          queryInterface.sequelize.query(
            `
            DELETE FROM appeal_event_log eventLog
            USING appeal_case appealCase
            WHERE eventLog.appeal_case_id = appealCase.id
              AND eventLog.event_type = 'APPEAL_STATEMENT_SENT'
              AND eventLog.user_role = 'DEFENDER'
              AND eventLog.created = appealCase.defendant_statement_date
              AND eventLog.defendant_id IS NULL
              AND eventLog.civil_claimant_id IS NULL
            `,
            { transaction },
          ),
        ),
    )
  },
}
