'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface.addColumn(
          'event_log',
          'comment',
          {
            type: Sequelize.TEXT,
            allowNull: true,
          },
          { transaction: t },
        ),
        queryInterface.addColumn(
          'date_log',
          'location',
          {
            type: Sequelize.TEXT,
            allowNull: true,
          },
          { transaction: t },
        ),
      ]),
    )
  },

  down: (queryInterface) => {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface.removeColumn('event_log', 'comment', {
          transaction: t,
        }),
        queryInterface.removeColumn('date_log', 'location', {
          transaction: t,
        }),
      ]),
    )
  },
}
