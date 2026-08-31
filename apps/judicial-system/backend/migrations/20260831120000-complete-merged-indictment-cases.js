'use strict'

// Two indictment cases were joined to a parent case that lives outside RVG and a
// judgement was pronounced on the joined case in GoPro, but the two cases were
// never completed in RVG. They cannot be completed through the UI any more: the
// only route runs through the arraignment step, which would summon the defendants
// to a court session that has long since been held. So they sit in the district
// court's "Í vinnslu" list months after the case was actually concluded.
//
// This migration records the conclusion the way the UI would have
// (Conclusion -> Summary -> CaseTransition.COMPLETE):
//   indictment_decision        = COMPLETING
//   indictment_ruling_decision = MERGE
//   merge_case_number          = the parent case number
//                                (merge_case_id stays null - the parent is not in RVG)
//   court_end_time / ruling_date = when the cases were joined and concluded
//   state                      = COMPLETED
// plus the INDICTMENT_COMPLETED event log entry the transition writes, which the
// statistics module and indictmentCompletedDate read.
//
// Deliberately NOT done, at the district court's request: none of the queue
// messages that normally follow the state change (case.service.ts
// addMessagesForCompletedIndictmentCaseToQueue) - no RULING notification to the
// parties, no delivery of the conclusion or the case files to the court system,
// and no delivery to the police system. The conclusion was recorded in GoPro at
// the time; this only brings RVG's own records in line with it.
//
// The cases end up in the district court's "Lokið" list tagged "Sameinað", with
// the info card reading "<parent case number> utan Réttarvörslugáttar". Nothing
// on the parent case is touched, no verdicts are created (only a RULING decision
// creates those), and the cases stay reopenable in RVG since merge_case_id is
// left null.
//
// Every statement is guarded so it no-ops rather than fails: in environments
// without these cases nothing matches, and in production a case that has since
// been completed by other means, or that is not in the expected shape, is left
// alone rather than blocking a deployment. Verify the two cases in the database
// after the migration has run. down is a no-op - re-opening a concluded case is
// not something a rollback should do on its own.

// ---------------------------------------------------------------------------
// Fill in before merging
// ---------------------------------------------------------------------------

// The court case number of the parent case the two cases were joined to.
// This case is not in RVG, so it is recorded as a number, not as a link.
const MERGE_CASE_NUMBER = 'S-UUU/2025'

// When the cases were joined and concluded in court - both court_end_time and
// ruling_date are set to this. Use the date of the court session in the parent
// case, not the date this migration runs: ruling_date is what the case lists
// show as the closing date and what the statistics module reports the ruling
// decision on.
const CONCLUSION_DATE = '2026-06-01 00:00:00.000000+00'

// The cases to complete. The court case number is not a unique key on its own,
// so the id decides which row is updated and the number is carried along as a
// guard - a mistyped id then updates nothing instead of the wrong case.
const CASES = [
  { id: '00000000-0000-0000-0000-000000000000', courtCaseNumber: 'S-YYY/2026' },
  { id: '00000000-0000-0000-0000-000000000000', courtCaseNumber: 'S-ZZZ/2026' },
]

// ---------------------------------------------------------------------------

// Only complete a case that is still waiting to be concluded and carries no
// conclusion of its own. A case that already has a ruling decision, is already
// merged into a case in RVG, or has verdicts attached is not the case this
// migration was written for and is left untouched.
const COMPLETABLE_GUARD = `
      "type" = 'INDICTMENT'
  AND "state" = 'RECEIVED'
  AND "indictment_ruling_decision" IS NULL
  AND "merge_case_id" IS NULL
  AND NOT EXISTS (
    SELECT 1 FROM "verdict" v
    JOIN "defendant" d ON d."id" = v."defendant_id"
    WHERE d."case_id" = "case"."id"
  )
`

module.exports = {
  async up(queryInterface) {
    return queryInterface.sequelize.transaction(async (transaction) => {
      for (const { id, courtCaseNumber } of CASES) {
        await queryInterface.sequelize.query(
          `UPDATE "case"
           SET "state" = 'COMPLETED',
               "indictment_decision" = 'COMPLETING',
               "indictment_ruling_decision" = 'MERGE',
               "merge_case_number" = :mergeCaseNumber,
               "court_end_time" = :conclusionDate,
               "ruling_date" = :conclusionDate,
               "modified" = NOW()
           WHERE "id" = :caseId
             AND "court_case_number" = :courtCaseNumber
             AND ${COMPLETABLE_GUARD}`,
          {
            replacements: {
              caseId: id,
              courtCaseNumber,
              mergeCaseNumber: MERGE_CASE_NUMBER,
              conclusionDate: CONCLUSION_DATE,
            },
            transaction,
          },
        )

        // Record the completion in the event log, as the transition does. The
        // actor is the judge assigned to the case - the historical actor is not
        // otherwise recoverable - and created is the conclusion date rather than
        // the migration instant, so the audit trail and the statistics report
        // when the case was actually concluded.
        //
        // Guarded on the completed shape, so this only inserts once the update
        // above has landed, and only once per case.
        await queryInterface.sequelize.query(
          `INSERT INTO "event_log" (
             "id", "created", "event_type", "case_id",
             "national_id", "user_role", "user_name", "user_title", "institution_name"
           )
           SELECT gen_random_uuid(), c."ruling_date", 'INDICTMENT_COMPLETED', c."id",
                  u."national_id", u."role", u."name", u."title", i."name"
           FROM "case" c
           LEFT JOIN "user" u ON u."id" = c."judge_id"
           LEFT JOIN "institution" i ON i."id" = u."institution_id"
           WHERE c."id" = :caseId
             AND c."court_case_number" = :courtCaseNumber
             AND c."state" = 'COMPLETED'
             AND c."indictment_ruling_decision" = 'MERGE'
             AND c."merge_case_number" = :mergeCaseNumber
             AND NOT EXISTS (
               SELECT 1 FROM "event_log" e
               WHERE e."case_id" = c."id"
                 AND e."event_type" = 'INDICTMENT_COMPLETED'
             )`,
          {
            replacements: {
              caseId: id,
              courtCaseNumber,
              mergeCaseNumber: MERGE_CASE_NUMBER,
            },
            transaction,
          },
        )
      }
    })
  },

  async down() {
    return Promise.resolve()
  },
}
