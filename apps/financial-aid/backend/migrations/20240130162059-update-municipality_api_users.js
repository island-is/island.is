'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface.removeColumn('municipality_api_users', 'password', {
          transaction: t,
        }),
        queryInterface.addColumn(
          'municipality_api_users',
          'api_key',
          {
            type: Sequelize.STRING,
            allowNull: false,
          },
          { transaction: t },
        ),
        queryInterface.addColumn(
          'municipality_api_users',
          'created',
          {
            type: 'TIMESTAMP WITH TIME ZONE',
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            allowNull: false,
          },
          { transaction: t },
        ),
        queryInterface.addColumn(
          'municipality_api_users',
          'modified',
          {
            type: 'TIMESTAMP WITH TIME ZONE',
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            allowNull: false,
          },
          { transaction: t },
        ),
      ]),
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface.addColumn(
          'municipality_api_users',
          'password',
          {
            type: Sequelize.STRING,
            allowNull: false,
          },
          { transaction: t },
        ),
        queryInterface.removeColumn('municipality_api_users', 'api_key', {
          transaction: t,
        }),
        queryInterface.removeColumn('municipality_api_users', 'created', {
          transaction: t,
        }),
        queryInterface.removeColumn('municipality_api_users', 'modified', {
          transaction: t,
        }),
      ]),
    )
  },
}
