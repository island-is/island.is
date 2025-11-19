'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.addColumn(
        'application',
        'post_pruned',
        {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
        { transaction: t },
      )

      await queryInterface.addColumn(
        'application',
        'post_prune_at',
        {
          type: Sequelize.DATE,
          allowNull: true,
          defaultValue: null,
        },
        { transaction: t },
      )

      await queryInterface.addIndex('application', ['post_prune_at'], {
        name: 'application_post_prune_pending_idx',
        where: {
          pruned: true,
          post_pruned: false,
        },
        transaction: t,
      })
    })
  },

  down: async (queryInterface) => {
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.removeIndex(
        'application',
        'application_post_prune_pending_idx',
        { transaction: t },
      )

      await queryInterface.removeColumn('application', 'post_pruned', {
        transaction: t,
      })

      await queryInterface.removeColumn('application', 'post_prune_at', {
        transaction: t,
      })
    })
  },
}
