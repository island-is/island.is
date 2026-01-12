'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await Promise.all([
      queryInterface.addColumn('application', 'user_deleted_at', {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: null,
      }),
      queryInterface.addColumn('application', 'user_deleted', {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      }),
    ])
  },

  down: async (queryInterface) => {
    await Promise.all([
      queryInterface.removeColumn('application', 'user_deleted_at'),
      queryInterface.removeColumn('application', 'user_deleted'),
    ])
  },
}
