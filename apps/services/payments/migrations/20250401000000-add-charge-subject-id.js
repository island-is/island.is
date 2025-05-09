'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.addColumn(
        'payment_flow',
        'charge_item_subject_id',
        {
          type: Sequelize.STRING,
          allowNull: true,
        },
        { transaction: t },
      )
    })
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.removeColumn(
        'payment_flow',
        'charge_item_subject_id',
        {
          transaction: t,
        },
      )
    })
  },
}
