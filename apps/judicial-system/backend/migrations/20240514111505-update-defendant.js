'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface.addColumn(
        'defendant',
        'verdict_view_date',
        { type: Sequelize.DATE, allowNull: true },
        { transaction: t },
      ),
    )
  },

  down: (queryInterface) => {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface.removeColumn('defendant', 'verdict_view_date', {
        transaction: t,
      }),
    )
  },
}
