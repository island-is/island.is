'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addIndex('state_history', ['application_id'], {
      name: 'application_id_index',
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeIndex('state_history', 'application_id_index')
  },
}
