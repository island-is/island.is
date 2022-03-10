'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface.addColumn(
          'application_events',
          'amount',
          {
            type: Sequelize.INTEGER,
            allowNull: true,
          },
          { transaction: t },
        ),
        queryInterface.addColumn(
          'application_events',
          'staff_comment',
          {
            type: Sequelize.STRING,
            allowNull: true,
          },
          { transaction: t },
        ),
      ]),
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface.removeColumn('application_events', 'amount', {
          transaction: t,
        }),
        queryInterface.removeColumn('application_events', 'staff_comment', {
          transaction: t,
        }),
      ]),
    )
  },
}
