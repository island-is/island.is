'use strict'

// A defendant in S-3823/2026 with a penalty order (viðurlagaákvörðun) was
// mistakenly closed without enforcement by the public prosecution office. The
// penalty order should have been sent to the prison administration for
// enforcement, and the UI offers no way to undo closing without enforcement.
//
// Closing without enforcement only sets the defendant flag and records a
// CLOSED_WITHOUT_ENFORCEMENT defendant event, so both are reverted here. With
// the flag cleared the defendant returns to the "Frestur liðinn" list, from
// where the office sends the penalty order to enforcement as usual.
//
// Guarded so it only touches this defendant while it is still closed, has an
// accepted review, has not been sent to the prison administration and belongs
// to a reviewed fine case - the conditions for the "Frestur liðinn" list. The
// event is only deleted when the defendant row was reopened. down is a no-op -
// the state being reverted was a mistake.

const CASE_ID = '79405cfe-d3d6-4487-bada-6e81f66d489b'
const DEFENDANT_ID = '31ddd7ab-c04f-4f38-8a7d-6491a17aca0b'

module.exports = {
  async up(queryInterface) {
    return queryInterface.sequelize.transaction((transaction) =>
      queryInterface.sequelize.query(
        `WITH reopened AS (
           UPDATE "defendant" d
           SET "is_closed_without_enforcement" = false,
               "modified" = NOW()
           WHERE d."id" = :defendantId
             AND d."case_id" = :caseId
             AND d."is_closed_without_enforcement" = true
             AND d."is_sent_to_prison_admin" IS NOT TRUE
             AND d."indictment_review_decision" = 'ACCEPT'
             AND EXISTS (
               SELECT 1 FROM "case" c
               WHERE c."id" = d."case_id"
                 AND c."indictment_ruling_decision" = 'FINE'
                 AND c."indictment_reviewer_id" IS NOT NULL
             )
           RETURNING d."id", d."case_id"
         )
         DELETE FROM "defendant_event_log" del
         USING reopened r
         WHERE del."defendant_id" = r."id"
           AND del."case_id" = r."case_id"
           AND del."event_type" = 'CLOSED_WITHOUT_ENFORCEMENT'`,
        {
          replacements: {
            caseId: CASE_ID,
            defendantId: DEFENDANT_ID,
          },
          transaction,
        },
      ),
    )
  },

  async down() {
    return Promise.resolve()
  },
}
