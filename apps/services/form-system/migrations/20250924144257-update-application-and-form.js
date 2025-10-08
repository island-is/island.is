'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    await Promise.all([
      queryInterface.addColumn('application', 'pruned', {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      }),
      queryInterface.addColumn('application', 'prune_at', {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: null,
      }),
      queryInterface.addColumn('application', 'draft_finished_steps', {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      }),
      queryInterface.addColumn('application', 'draft_total_steps', {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      }),
      queryInterface.addColumn('application', 'state', {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: '',
      }),
      queryInterface.addColumn('application', 'national_id', {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: '',
      }),
      queryInterface.addColumn('form', 'draft_total_steps', {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      }),
    ])
  },

  async down(queryInterface) {
    await Promise.all([
      queryInterface.removeColumn('application', 'pruned'),
      queryInterface.removeColumn('application', 'prune_at'),
      queryInterface.removeColumn('application', 'draft_finished_steps'),
      queryInterface.removeColumn('application', 'draft_total_steps'),
      queryInterface.removeColumn('application', 'state'),
      queryInterface.removeColumn('application', 'national_id'),
      queryInterface.removeColumn('form', 'draft_total_steps'),
    ])
  },
}
