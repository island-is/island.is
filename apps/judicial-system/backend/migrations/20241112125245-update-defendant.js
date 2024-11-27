'use strict'

module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((transaction) =>
      queryInterface.addColumn(
        'defendant',
        'is_sent_to_prison_admin',
        {
          type: Sequelize.BOOLEAN,
          allowNull: true,
        },
        { transaction },
      ),
    )
  },

  down(queryInterface) {
    return queryInterface.sequelize.transaction((transaction) =>
      queryInterface.removeColumn('defendant', 'is_sent_to_prison_admin', {
        transaction,
      }),
    )
  },
}
