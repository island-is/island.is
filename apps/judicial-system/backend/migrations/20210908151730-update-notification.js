'use strict'

module.exports = {
  up: (queryInterface) => {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface.removeColumn('notification', 'condition', {
        transaction: t,
      }),
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface.addColumn(
        'notification',
        'condition',
        {
          type: Sequelize.STRING,
          allowNull: true,
        },
        { transaction: t },
      ),
    )
  },
}
