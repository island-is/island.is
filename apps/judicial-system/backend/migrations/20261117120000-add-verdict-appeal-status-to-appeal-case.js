'use strict'

// How far the court of appeals has come with a verdict appeal, as the court
// records it on its status step. Null until the court has recorded one, so
// existing rows need no backfill.
//
// Stored as a plain string, not a Postgres enum - the values are validated in
// the model (DataType.ENUM over VerdictAppealStatus) and adding a value to a
// DB enum needs its own migration. Matches appeal_case.appeal_type.

module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.sequelize.transaction((transaction) =>
      queryInterface.addColumn(
        'appeal_case',
        'verdict_appeal_status',
        { type: Sequelize.STRING, allowNull: true },
        { transaction },
      ),
    ),

  down: (queryInterface) =>
    queryInterface.sequelize.transaction((transaction) =>
      queryInterface.removeColumn('appeal_case', 'verdict_appeal_status', {
        transaction,
      }),
    ),
}
