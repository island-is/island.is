'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await Promise.all([
        queryInterface.addColumn(
          'application',
          'pruned',
          {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
          },
          { transaction },
        ),
        queryInterface.addColumn(
          'application',
          'prune_at',
          {
            type: Sequelize.DATE,
            allowNull: true,
            defaultValue: null,
          },
          { transaction },
        ),
        queryInterface.addColumn(
          'application',
          'draft_finished_steps',
          {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0,
          },
          { transaction },
        ),
        queryInterface.addColumn(
          'application',
          'draft_total_steps',
          {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0,
          },
          { transaction },
        ),
        queryInterface.addColumn(
          'application',
          'state',
          {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: '',
          },
          { transaction },
        ),
        queryInterface.addColumn(
          'application',
          'national_id',
          {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: '',
          },
          { transaction },
        ),
        queryInterface.addColumn(
          'form',
          'draft_total_steps',
          {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0,
          },
          { transaction },
        ),
      ])
    })
  },

  async down(queryInterface) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await Promise.all([
        queryInterface.removeColumn('application', 'pruned', { transaction }),
        queryInterface.removeColumn('application', 'prune_at', { transaction }),
        queryInterface.removeColumn('application', 'draft_finished_steps', {
          transaction,
        }),
        queryInterface.removeColumn('application', 'draft_total_steps', {
          transaction,
        }),
        queryInterface.removeColumn('application', 'state', { transaction }),
        queryInterface.removeColumn('application', 'national_id', {
          transaction,
        }),
        queryInterface.removeColumn('form', 'draft_total_steps', {
          transaction,
        }),
      ])
    })
  },
}
