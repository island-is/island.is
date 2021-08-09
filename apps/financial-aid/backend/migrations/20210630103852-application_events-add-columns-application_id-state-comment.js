'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface.addColumn(
          'application_events',
          'application_id',
          {
            type: Sequelize.UUID,
            references: {
              model: 'applications',
              key: 'id',
            },
            allowNull: false,
          },
          { transaction: t },
        ),
        queryInterface.addColumn(
          'application_events',
          'comment',
          {
            type: Sequelize.STRING,
            allowNull: false,
          },
          { transaction: t },
        ),
        queryInterface.addColumn(
          'application_events',
          'state',
          {
            type: Sequelize.ENUM(
              'New',
              'InProgress',
              'Rejected',
              'DataNeeded',
              'Approved',
            ),
            allowNull: false,
            defaultValue: 'New',
          },
          { transaction: t },
        ),
      ]),
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface.removeColumn('application_events', 'application_id', {
          transaction: t,
        }),
        queryInterface.removeColumn('application_events', 'comment', {
          transaction: t,
        }),
        queryInterface.removeColumn('application_events', 'state', {
          transaction: t,
        }),
      ]),
    )
  },
}
