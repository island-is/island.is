'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.addColumn(
        'payment_flow',
        'payer_national_id',
        {
          type: Sequelize.STRING,
          allowNull: true, // Temporarily allow null
        },
        { transaction: t },
      )

      await queryInterface.sequelize.query(
        `UPDATE payment_flow SET payer_national_id = '0101302399' WHERE payer_national_id IS NULL`,
        { transaction: t },
      )

      await queryInterface.changeColumn(
        'payment_flow',
        'payer_national_id',
        {
          type: Sequelize.STRING,
          allowNull: false, // Now enforce non-null constraint
        },
        { transaction: t },
      )
    })
  },

  down: async (queryInterface) => {
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.removeColumn('payment_flow', 'payer_national_id', {
        transaction: t,
      })
    })
  },
}
