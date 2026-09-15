'use strict'

// Phase 1 of the per-defendant defender migration for request cases.
//
// Request cases (restriction, investigation) currently store a single defender
// on the case row. The target model stores defender info per defendant, matching
// indictment cases. This migration copies the case-level defender fields to
// every defendant in each request case that has a defender assigned or where
// the defendant waived their right to counsel, so the dual-write introduced
// in the application code has correct data for existing cases.
//
// Safety: only defendants whose defender_choice is still NULL are touched, and
// only when the case has either a defender_name set or
// defendant_waives_right_to_counsel enabled. Indictment defendants already have
// their own defender fields populated through the per-defendant write path, so
// these conditions exclude them naturally. This makes the migration idempotent
// and safe to re-run.

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
               WHEN c.defender_name IS NOT NULL THEN 'CHOOSE'
               ELSE NULL
             END,
             is_defender_choice_confirmed = CASE
               WHEN c.defendant_waives_right_to_counsel = true THEN true
               WHEN c.defender_name IS NOT NULL THEN true
               ELSE NULL
             END
         FROM "case" c
         WHERE d.case_id = c.id
           AND d.defender_choice IS NULL
           AND (c.defender_name IS NOT NULL
                OR c.defendant_waives_right_to_counsel = true)`,
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
