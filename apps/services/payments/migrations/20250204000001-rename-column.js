'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.renameColumn(
        'payment_flow_fjs_charge_confirmation',
        'updated',
        'modified',
        { transaction: t },
      )
    })
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.renameColumn(
        'payment_flow_fjs_charge_confirmation',
        'modified',
        'updated',
        { transaction: t },
      )
    })
  },
}
