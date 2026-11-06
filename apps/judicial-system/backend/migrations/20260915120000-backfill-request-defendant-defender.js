'use strict'

// Phase 1 of the per-defendant defender migration for request cases.
//
// Request cases (restriction, investigation) currently store a single defender
// on the case row. The target model stores defender info per defendant. This
// migration copies the case-level defender contact fields to every defendant
// in each request case so the dual-write introduced in the application code
// has correct data for existing cases — including cleaned/encrypted cases
// whose contact fields may already be empty.
//
// Waive is mapped to defendant.defender_choice = 'WAIVE' when
// case.defendant_waives_right_to_counsel is true; otherwise defender_choice
// is set to NULL. R-cases do not use CHOOSE or is_defender_choice_confirmed
// (indictment confirmation workflow).
//
// Scope: all non-indictment, non-DELETED cases. Copy regardless of whether
// the case currently has a defender or waive flag set.

module.exports = {
  async up(queryInterface) {
    return queryInterface.sequelize.transaction((transaction) =>
      queryInterface.sequelize.query(
        `UPDATE defendant d
         SET defender_name = c.defender_name,
             defender_national_id = c.defender_national_id,
             defender_email = c.defender_email,
             defender_phone_number = c.defender_phone_number,
             defender_choice = CASE
               WHEN c.defendant_waives_right_to_counsel = true THEN 'WAIVE'
               ELSE NULL
             END
         FROM "case" c
         WHERE d.case_id = c.id
           AND c.type <> 'INDICTMENT'
           AND c.state <> 'DELETED'`,
        { transaction },
      ),
    )
  },

  // No-op. The backfilled data is harmless — nothing reads defendant-level
  // defender fields for request cases until later phases flip the read paths.
  // A destructive rollback risks clearing data that was set independently
  // through the per-defendant write path.
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async down() {},
}
