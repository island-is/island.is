'use strict'

const TABLE = 'bank_transfer_payment'
const COLUMN = 'bank_code'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.addColumn(
        TABLE,
        COLUMN,
        {
          type: Sequelize.STRING(4),
          allowNull: true,
        },
        { transaction: t },
      )
    })
  },

  down: async (queryInterface) => {
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.removeColumn(TABLE, COLUMN, { transaction: t })
    })
  },
}
