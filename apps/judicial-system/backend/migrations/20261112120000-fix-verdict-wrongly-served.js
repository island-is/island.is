'use strict'

// A verdict was mistakenly registered as served in the police system, and the
// registration was delivered here. The verdict has not been served, so the
// service fields that came with it are cleared and the verdict goes back to
// awaiting service.
// Guarded so it only touches the verdict while it is still registered as
// served. down is a no-op - the state being reverted was a mistake.

const VERDICT_ID = '<verdict id>'

module.exports = {
  async up(queryInterface) {
    return queryInterface.sequelize.transaction((transaction) =>
      queryInterface.sequelize.query(
        `UPDATE "verdict"
         SET "service_status" = NULL,
             "service_date" = NULL,
             "served_by" = NULL,
             "comment" = NULL,
             "delivered_to_defender_national_id" = NULL,
             "modified" = NOW()
         WHERE "id" = :verdictId
           AND "service_requirement" = 'REQUIRED'
           AND "service_status" IS NOT NULL
           AND "service_date" IS NOT NULL`,
        { replacements: { verdictId: VERDICT_ID }, transaction },
      ),
    )
  },

  async down() {
    return Promise.resolve()
  },
}
