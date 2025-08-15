'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface.addColumn(
          'application',
          'post_pruned',
          {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
          },
          { transaction: t },
        ),
        queryInterface.addColumn(
          'application',
          'post_prune_at',
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
        queryInterface.removeColumn('application', 'post_pruned', {
          transaction: t,
        }),
        queryInterface.removeColumn('application', 'post_prune_at', {
          transaction: t,
        }),
      ]),
    )
  },
}
