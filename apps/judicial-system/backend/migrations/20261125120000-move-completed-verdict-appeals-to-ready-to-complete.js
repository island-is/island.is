'use strict'

// A verdict appeal the court of appeals concludes is now first confirmed by the
// court (READY_TO_COMPLETE) and completed only when its outcome is released
// (COMPLETED). Every verdict appeal completed so far was confirmed by the court
// and never released, so it moves to READY_TO_COMPLETE. Ruling appeals are not
// touched.

module.exports = {
  up: (queryInterface) => {
    return queryInterface.sequelize.transaction((transaction) =>
      queryInterface.sequelize.query(
        `UPDATE "appeal_case"
         SET "appeal_state" = 'READY_TO_COMPLETE'
         WHERE "appeal_type" = 'VERDICT'
           AND "appeal_state" = 'COMPLETED'`,
        { transaction },
      ),
    )
  },

  down: (queryInterface) => {
    return queryInterface.sequelize.transaction((transaction) =>
      queryInterface.sequelize.query(
        `UPDATE "appeal_case"
         SET "appeal_state" = 'COMPLETED'
         WHERE "appeal_type" = 'VERDICT'
           AND "appeal_state" = 'READY_TO_COMPLETE'`,
        { transaction },
      ),
    )
  },
}
