'use strict'

// Phase 1 of the per-defendant defender migration for request cases.
//
// Request cases (restriction, investigation) currently store a single defender
// on the case row. The target model stores defender info per defendant, matching
// indictment cases. This migration copies the case-level defender fields to
// every defendant in each request case that has a defender assigned, so the
// dual-write introduced in the application code has correct data for existing
// cases.
//
// Only defendants whose defender_name is still NULL are touched, making the
// migration idempotent and safe to re-run.

const REQUEST_CASE_TYPES = [
  'ADMISSION_TO_FACILITY',
  'CUSTODY',
  'TRAVEL_BAN',
  'AUTOPSY',
  'BANKING_SECRECY_WAIVER',
  'BODY_SEARCH',
  'ELECTRONIC_DATA_DISCOVERY_INVESTIGATION',
  'EXPULSION_FROM_HOME',
  'INTERNET_USAGE',
  'OTHER',
  'PAROLE_REVOCATION',
  'PHONE_TAPPING',
  'PSYCHIATRIC_EXAMINATION',
  'RESTRAINING_ORDER',
  'RESTRAINING_ORDER_AND_EXPULSION_FROM_HOME',
  'SEARCH_WARRANT',
  'SOUND_RECORDING_EQUIPMENT',
  'STATEMENT_FROM_MINOR',
  'STATEMENT_IN_COURT',
  'TELECOMMUNICATIONS',
  'TRACKING_EQUIPMENT',
  'VIDEO_RECORDING_EQUIPMENT',
]

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
               WHEN c.defender_name IS NOT NULL THEN true
               ELSE NULL
             END
         FROM "case" c
         WHERE d.case_id = c.id
           AND c.type IN (:requestCaseTypes)
           AND d.defender_name IS NULL
           AND c.defender_name IS NOT NULL`,
        { replacements: { requestCaseTypes: REQUEST_CASE_TYPES }, transaction },
      ),
    )
  },

  async down(queryInterface) {
    return queryInterface.sequelize.transaction((transaction) =>
      queryInterface.sequelize.query(
        `UPDATE defendant d
         SET defender_name = NULL,
             defender_national_id = NULL,
             defender_email = NULL,
             defender_phone_number = NULL,
             defender_choice = NULL,
             is_defender_choice_confirmed = NULL
         FROM "case" c
         WHERE d.case_id = c.id
           AND c.type IN (:requestCaseTypes)`,
        { replacements: { requestCaseTypes: REQUEST_CASE_TYPES }, transaction },
      ),
    )
  },
}
