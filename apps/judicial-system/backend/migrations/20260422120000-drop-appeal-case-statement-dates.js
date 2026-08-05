'use strict'

// Drops the legacy aggregated statement date columns from appeal_case.
// The appeal_event_log table is now the source of truth — populated for
// historical cases by 20260421120000-backfill-appeal-event-log.js, and for
// new statements by the createAppealEventLog mutation.
//
// Reversible. The down migration re-adds the columns as nullable but does
// not restore data; rerun the backfill migration in reverse if needed.
const columns = ['prosecutor_statement_date', 'defendant_statement_date']

module.exports = {
  up: (queryInterface) => {
    return queryInterface.sequelize.transaction((transaction) =>
      columns.reduce(
        (promise, column) =>
          promise.then(() =>
            queryInterface.removeColumn('appeal_case', column, { transaction }),
          ),
        Promise.resolve(),
      ),
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((transaction) =>
      columns.reduce(
        (promise, column) =>
          promise.then(() =>
            queryInterface.addColumn(
              'appeal_case',
              column,
              { type: Sequelize.DATE, allowNull: true },
              { transaction },
            ),
          ),
        Promise.resolve(),
      ),
    )
  },
}
