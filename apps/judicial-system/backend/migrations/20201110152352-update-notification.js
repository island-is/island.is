'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface.addColumn(
          'notification',
          'condition',
          {
            type: Sequelize.STRING,
            allowNull: true,
          },
          { transaction: t },
        ),
        queryInterface.addColumn(
          'notification',
          'recipients',
          {
            type: Sequelize.STRING,
            allowNull: true,
          },
          { transaction: t },
        ),
        queryInterface.removeColumn('notification', 'message', {
          transaction: t,
        }),
      ]),
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface.addColumn(
          'notification',
          'message',
          {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: '',
          },
          { transaction: t },
        ),
        queryInterface.removeColumn('notification', 'condition', {
          transaction: t,
        }),
        queryInterface.removeColumn('notification', 'recipients', {
          transaction: t,
        }),
      ]),
    )
  },
}
