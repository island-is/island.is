'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.addIndex('payment_flow_event', ['payment_flow_id'], {
        name: 'payment_flow_event_payment_completed_idx',
        where: {
          reason: 'payment_completed',
        },
        transaction: t,
      })
    })
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.removeIndex(
        'payment_flow_event',
        'payment_flow_event_payment_completed_idx',
        { transaction: t },
      )
    })
  },
}
