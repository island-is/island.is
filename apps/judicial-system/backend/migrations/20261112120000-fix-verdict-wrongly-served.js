'use strict'

// The public prosecution office mistakenly registered a service date on a
// verdict that has not been served. The date is cleared so the verdict goes
// back to awaiting service.
// Guarded so it only touches the verdict while it carries a manually
// registered date - a verdict the police have served has a service status.
// down is a no-op - the state being reverted was a mistake.

const VERDICT_ID = '<verdict id>'

module.exports = {
  async up(queryInterface) {
    return queryInterface.sequelize.transaction((transaction) =>
      queryInterface.sequelize.query(
        `UPDATE "verdict"
         SET "service_date" = NULL,
             "modified" = NOW()
         WHERE "id" = :verdictId
           AND "service_requirement" = 'REQUIRED'
           AND "service_date" IS NOT NULL
           AND "service_status" IS NULL`,
        { replacements: { verdictId: VERDICT_ID }, transaction },
      ),
    )
  },

  async down() {
    return Promise.resolve()
  },
}
