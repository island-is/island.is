'use strict'

// The case was opened for correction so a registrar could
// update publication status, but completion requires an active judge on the case.
// The assigned judge has since become inactive, leaving the case stuck in
// CORRECTING with no way to finish the workflow in the UI.
//
// No case content was changed — move the case back to COMPLETED without updating
// ruling_modified_history and without sending notifications (this migration only
// updates state in the database).

const CASE_ID = 'e9244b8a-22c9-4bd8-922a-e615ed7cd399'

module.exports = {
  async up(queryInterface) {
    return queryInterface.sequelize.transaction((transaction) =>
      queryInterface.sequelize.query(
        `UPDATE "case"
         SET "state" = 'COMPLETED'
         WHERE "id" = :caseId
           AND "state" = 'CORRECTING'`,
        {
          replacements: {
            caseId: CASE_ID,
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
