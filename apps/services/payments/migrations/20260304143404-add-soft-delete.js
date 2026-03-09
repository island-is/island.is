'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.addColumn(
        'payment_flow',
        'is_deleted',
        {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
        { transaction: t },
      )

      await queryInterface.addColumn(
        'fjs_charge',
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
      await queryInterface.removeColumn('payment_flow', 'is_deleted', {
        transaction: t,
      })

      await queryInterface.removeColumn('fjs_charge', 'is_deleted', {
        transaction: t,
      })
    })
  },
}
