'use strict'

// Backfills appeal_decision with the IN-COURT appeal decisions of request cases
// from the legacy case columns: one PROSECUTOR row and one DEFENDANT row per
// case (the defence row covers the defence collectively, so it has no
// defendant_id). ruling_file_id is NULL - these are case-level court decisions.
//
// Not backfilled here:
//   - indictment case-level (dismissal) appeals: out of court, never stored in
//     appeal_decision;
//   - ruling-order in-court decisions: none exist yet;
//   - "who appealed" out of court: tracked in appeal_event_log (APPEALED), whose
//     historical backfill is deferred until read-switch.
//
// Idempotent: ON CONFLICT DO NOTHING against appeal_decision_case_ruling_party_uq
// leaves rows already created by dual-write untouched.
//
// down() deletes all appeal_decision rows. Safe in Phase 1: the legacy case
// columns remain the source of truth and re-running up() rebuilds the table.
module.exports = {
  up: (queryInterface) => {
    return queryInterface.sequelize.transaction(async (transaction) => {
      // Prosecution in-court decision (request cases).
      await queryInterface.sequelize.query(
        `INSERT INTO appeal_decision
           (id, created, modified, case_id, ruling_file_id, party_role,
            decision, announcement)
         SELECT
           gen_random_uuid(), NOW(), NOW(), c.id, NULL, 'PROSECUTOR',
           c.prosecutor_appeal_decision::text, c.prosecutor_appeal_announcement
         FROM "case" c
         WHERE c.type <> 'INDICTMENT'
           AND (c.prosecutor_appeal_decision IS NOT NULL
                OR c.prosecutor_appeal_announcement IS NOT NULL)
         ON CONFLICT DO NOTHING`,
        { transaction },
      )

      // Defence in-court decision (request cases) - a single row, no defendant.
      await queryInterface.sequelize.query(
        `INSERT INTO appeal_decision
           (id, created, modified, case_id, ruling_file_id, party_role,
            decision, announcement)
         SELECT
           gen_random_uuid(), NOW(), NOW(), c.id, NULL, 'DEFENDANT',
           c.accused_appeal_decision::text, c.accused_appeal_announcement
         FROM "case" c
         WHERE c.type <> 'INDICTMENT'
           AND (c.accused_appeal_decision IS NOT NULL
                OR c.accused_appeal_announcement IS NOT NULL)
         ON CONFLICT DO NOTHING`,
        { transaction },
      )
    })
  },

  down: (queryInterface) => {
    return queryInterface.sequelize.transaction((transaction) =>
      queryInterface.sequelize.query('DELETE FROM appeal_decision', {
        transaction,
      }),
    )
  },
}
