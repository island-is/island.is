'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface.addColumn(
          'provider',
          'xroad',
          {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
          },
          { transaction: t },
        ),
        queryInterface.addColumn(
          'provider',
          'external_provider_id',
          {
            type: Sequelize.STRING,
            allowNull: true,
            unique: true,
          },
          { transaction: t },
        ),
      ]),
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface.removeColumn('provider', 'xroad', {
          transaction: t,
        }),
        queryInterface.removeColumn('provider', 'external_provider_id', {
          transaction: t,
        }),
      ]),
    )
  },
}
