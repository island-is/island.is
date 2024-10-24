'use strict'

module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((transaction) =>
      queryInterface.addColumn(
        'defendant',
        'verdict_appeal_date',
        {
          type: Sequelize.DATE,
          allowNull: true,
        },
        { transaction },
      ),
    )
  },

  down(queryInterface) {
    return queryInterface.sequelize.transaction((transaction) =>
      queryInterface.removeColumn('defendant', 'verdict_appeal_date', {
        transaction,
      }),
    )
  },
}
