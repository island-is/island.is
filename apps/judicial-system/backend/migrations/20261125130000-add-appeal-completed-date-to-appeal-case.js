'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface.addColumn(
        'appeal_case',
        'appeal_completed_date',
        { type: Sequelize.DATE, allowNull: true },
        { transaction: t },
      ),
    )
  },

  down: (queryInterface) => {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface.removeColumn('appeal_case', 'appeal_completed_date', {
        transaction: t,
      }),
    )
  },
}
