'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.addColumn(
        'card_payment_details',
        'is_deleted',
        {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
        { transaction: t },
      )

      await queryInterface.addColumn(
        'payment_fulfillment',
        'is_deleted',
        {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
        { transaction: t },
      )
    })
  },

  down: async (queryInterface) => {
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.removeColumn('card_payment_details', 'is_deleted', {
        transaction: t,
      })

      await queryInterface.removeColumn('payment_fulfillment', 'is_deleted', {
        transaction: t,
      })
    })
  },
}
