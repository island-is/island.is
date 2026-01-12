'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.addColumn(
        'payment_flow',
        'extra_data',
        {
          type: Sequelize.JSON,
          allowNull: true,
        },
        { transaction: t },
      )
    })
  },

  down: async (queryInterface) => {
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.removeColumn('payment_flow', 'extra_data', {
        transaction: t,
      })
    })
  },
}
