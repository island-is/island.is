'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface.addColumn(
          'applications',
          'application_events_id',
          {
            type: Sequelize.UUID,
            references: {
              model: 'application_events',
              key: 'id',
            },
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
        queryInterface.removeColumn('applications', 'application_events_id', {
          transaction: t,
        }),
      ]),
    )
  },
}
