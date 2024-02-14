'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface.removeColumn(
          'municipality_api_users',
          'municipality_id',
          {
            transaction: t,
          },
        ),
        queryInterface.addColumn(
          'municipality_api_users',
          'municipality_code',
          {
            type: Sequelize.STRING,
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
          'municipality_id',
          {
            type: Sequelize.STRING,
            allowNull: false,
          },
          { transaction: t },
        ),
        queryInterface.removeColumn(
          'municipality_api_users',
          'municipality_code',
          {
            transaction: t,
          },
        ),
      ]),
    )
  },
}
