'use strict'

// Strips the '-' separator from every national id column across all tables,
// mirroring the nationalIdTransformer that already normalizes these values on
// write. The defendant.national_id column was already cleaned in
// 20241121185031-strip-national-id-hyphen.js, but it is included here as well
// so the normalization is complete and idempotent (the WHERE clause only
// matches rows that still contain a hyphen).
const NATIONAL_ID_COLUMNS = [
  { table: 'user', column: 'national_id' },
  { table: 'defendant', column: 'national_id' },
  { table: 'defendant', column: 'defender_national_id' },
  { table: 'defendant', column: 'requested_defender_national_id' },
  { table: 'victim', column: 'national_id' },
  { table: 'victim', column: 'lawyer_national_id' },
  { table: 'civil_claimant', column: 'national_id' },
  { table: 'civil_claimant', column: 'spokesperson_national_id' },
  { table: 'case', column: 'defender_national_id' },
  { table: 'case', column: 'police_defendant_national_id' },
  { table: 'subpoena', column: 'defender_national_id' },
  { table: 'verdict', column: 'delivered_to_defender_national_id' },
  { table: 'event_log', column: 'national_id' },
  { table: 'defendant_event_log', column: 'national_id' },
  { table: 'institution', column: 'national_id' },
  { table: 'lawyer_registry', column: 'national_id' },
  { table: 'appeal_case', column: 'appealed_by_national_id' },
]

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((transaction) =>
      Promise.all(
        NATIONAL_ID_COLUMNS.map(({ table, column }) =>
          queryInterface.bulkUpdate(
            table,
            {
              [column]: queryInterface.sequelize.literal(
                `REPLACE(${column}, '-', '')`,
              ),
            },
            { [column]: { [Sequelize.Op.like]: '%-%' } },
            { transaction },
          ),
        ),
      ),
    )
  },

  async down() {
    // Irreversible: the original hyphen positions are not recoverable.
    return
  },
}
