'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface.addColumn(
          'application',
          'is_listed',
          {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true,
          },
          { transaction: t },
        ),
        queryInterface.addColumn(
          'application',
          'prune_at',
          {
            type: 'TIMESTAMP WITH TIME ZONE',
            allowNull: true,
            defaultValue: null,
          },
          { transaction: t },
        ),
      ]),
    )
  },

  down: async (queryInterface) => {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface.removeColumn('application', 'is_listed', {
          transaction: t,
        }),
        queryInterface.removeColumn('application', 'prune_at', {
          transaction: t,
        }),
      ]),
    )
  },
}
