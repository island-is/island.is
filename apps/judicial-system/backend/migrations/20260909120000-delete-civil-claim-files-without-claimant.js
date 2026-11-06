'use strict'

// Civil claim files can end up on a case without a civil claimant the case
// knows about. The prosecutor's processing page filters civil claim files by
// the case's own claimants, so such files are invisible there while still
// listed on the court overview and still attached to every subpoena delivered
// to the police. Prosecutors who could not see the files re-uploaded them,
// leaving duplicates that no UI can remove.
//
// This soft-deletes the listed civil claim files the same way the application
// deletes an indictment case file: state DELETED and the key made
// inaccessible. Rows are never removed, since court_document may reference
// them. S3 objects are left in place, as the app does.
//
// The case and category predicates guard against a mistyped id hitting some
// other file. Idempotent: already deleted rows are excluded by the state
// predicate.
const CASE_ID = 'c5f940b6-c413-435b-8a4a-b32aa455b441'
const CASE_FILE_IDS = [
  '01110bf6-1dc0-4498-9506-d5f2becc3bc9',
  '3e85daf1-73d5-4416-8559-968539397fea',
]

module.exports = {
  async up(queryInterface) {
    return queryInterface.sequelize.transaction((transaction) =>
      queryInterface.sequelize.query(
        `UPDATE case_file
         SET state = 'DELETED',
             is_key_accessible = false,
             modified = NOW()
         WHERE case_id = :caseId
           AND id IN (:caseFileIds)
           AND category = 'CIVIL_CLAIM'
           AND state <> 'DELETED'`,
        {
          replacements: { caseId: CASE_ID, caseFileIds: CASE_FILE_IDS },
          transaction,
        },
      ),
    )
  },

  down: () => Promise.resolve(),
}
