'use strict'

module.exports = {
  up: async (queryInterface) => {
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.removeConstraint(
        'payment_fulfillment',
        'payment_fulfillment_payment_flow_id_key',
        { transaction: t },
      )
    })
  },

  down: async (queryInterface) => {
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.addConstraint('payment_fulfillment', {
        fields: ['payment_flow_id'],
        type: 'unique',
        name: 'payment_fulfillment_payment_flow_id_key',
        transaction: t,
      })
    })
  },
}
