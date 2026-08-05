'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.addColumn(
        'payment_flow',
        'invoice_return_url',
        {
          type: Sequelize.STRING,
          allowNull: true,
        },
        { transaction: t },
      )

      await queryInterface.addColumn(
        'payment_flow',
        'redirect_on_invoice_creation',
        {
          type: Sequelize.BOOLEAN,
          allowNull: true,
        },
        { transaction: t },
      )
    })
  },

  down: async (queryInterface) => {
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.removeColumn('payment_flow', 'invoice_return_url', {
        transaction: t,
      })

      await queryInterface.removeColumn(
        'payment_flow',
        'redirect_on_invoice_creation',
        { transaction: t },
      )
    })
  },
}
