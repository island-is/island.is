'use strict'

// A verdict was mistakenly registered as served in the police system, and the
// registration was delivered here. The verdict has not been served, so the
// service fields that came with it are cleared and the verdict goes back to
// awaiting service.
// A service certificate may have been delivered to the police on the strength
// of the wrong service date. Its event is deleted along with the service, as
// it would otherwise keep a certificate from being delivered once the verdict
// has been served.
// Guarded so it only touches the verdict while it is still registered as
// served, and the event is only deleted when the verdict was reverted. down is
// a no-op - the state being reverted was a mistake.

const VERDICT_ID = '<verdict id>'

module.exports = {
  async up(queryInterface) {
    return queryInterface.sequelize.transaction((transaction) =>
      queryInterface.sequelize.query(
        `WITH reverted AS (
           UPDATE "verdict"
           SET "service_status" = NULL,
               "service_date" = NULL,
               "served_by" = NULL,
               "comment" = NULL,
               "delivered_to_defender_national_id" = NULL,
               "modified" = NOW()
           WHERE "id" = :verdictId
             AND "service_requirement" = 'REQUIRED'
             AND "service_status" IS NOT NULL
             AND "service_date" IS NOT NULL
           RETURNING "id"
         )
         DELETE FROM "defendant_event_log" del
         USING reverted r
         WHERE del."verdict_id" = r."id"
           AND del."event_type" = 'VERDICT_SERVICE_CERTIFICATE_DELIVERED_TO_POLICE'`,
        { replacements: { verdictId: VERDICT_ID }, transaction },
      ),
    )
  },

  async down() {
    return Promise.resolve()
  },
}
