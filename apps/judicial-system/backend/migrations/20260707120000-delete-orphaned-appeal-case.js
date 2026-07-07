'use strict'

// A single orphaned appeal case exists in production with no appeal behind it.
// The case (PSYCHIATRIC_EXAMINATION) completed on 2024-10-29 with both parties
// accepting the ruling, yet an appeal case was created 17 months later on
// 2026-03-30 (created == appeal_date == 2026-03-30T14:48:12.395Z). It carries no
// evidence of a real appeal: no APPEALED event, no postponed appeal dates, no
// appealed_by_national_id, no APPEAL decision, and it never progressed past
// APPEALED (no appeal case number, no received-by-court date, no judges, no
// ruling, no appeal files).
//
// Slice 9 authorizes appeal withdrawal from the APPEALED event log, so this row
// would sit un-withdrawable and unresolvable forever. The backfill cannot infer
// an appellant for it (no signal exists), so we delete the stale appeal case
// instead. The two case-level ACCEPT appeal_decision rows correctly reflect the
// case and are left untouched (they carry no appeal_case_id link).
//
// Guarded so it no-ops if the row was already removed manually or if it somehow
// progressed. down is a no-op - a spurious row that should never have existed is
// not sensibly restorable.

const APPEAL_CASE_ID = 'ad5a23ab-b2e4-4c05-82d3-c184a9894485'

module.exports = {
  async up(queryInterface) {
    return queryInterface.sequelize.transaction((transaction) =>
      queryInterface.sequelize.query(
        `DELETE FROM "appeal_case" ac
         WHERE ac."id" = :appealCaseId
           AND ac."appeal_state" = 'APPEALED'
           AND ac."appeal_case_number" IS NULL
           AND ac."appeal_received_by_court_date" IS NULL
           AND NOT EXISTS (
             SELECT 1 FROM "appeal_event_log" ael
             WHERE ael."appeal_case_id" = ac."id"
           )`,
        {
          replacements: {
            appealCaseId: APPEAL_CASE_ID,
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
