'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface.removeColumn('application_events', 'application_id', {
          transaction: t,
        }),
      ]),
    )
  },

  down: (queryInterface, Sequelize) => {
    Promise.all([
      queryInterface.addColumn(
        'application_events',
        'application_id',
        {
          type: Sequelize.UUID,
          allowNull: false,
        },
        { transaction: t },
      )
    ])
  },
}
