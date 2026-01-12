'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.addColumn(
        'payment_flow_payment_confirmation',
        'merchant_reference_data',
        {
          type: Sequelize.STRING,
          allowNull: false,
          defaultValue: '',
        },
        { transaction: t },
      )
    })
  },

  down: async (queryInterface) => {
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.removeColumn(
        'payment_flow_payment_confirmation',
        'merchant_reference_data',
        {
          transaction: t,
        },
      )
    })
  },
}
