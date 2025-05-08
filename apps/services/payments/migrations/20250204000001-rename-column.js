'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.renameColumn(
        'payment_flow_event',
        'updated',
        'modified',
        { transaction: t },
      )
    })
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.renameColumn(
        'payment_flow_event',
        'modified',
        'updated',
        { transaction: t },
      )
    })
  },
}
