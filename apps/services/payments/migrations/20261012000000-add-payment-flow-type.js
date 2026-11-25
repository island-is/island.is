'use strict'

const TABLE = 'payment_flow'
const COLUMN = 'type'
const ENUM_NAME = 'enum_payment_flow_type'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.addColumn(
        TABLE,
        COLUMN,
        {
          type: Sequelize.ENUM('charge', 'debt'),
          allowNull: false,
          defaultValue: 'charge',
        },
        { transaction: t },
      )
    })
  },

  down: async (queryInterface) => {
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.removeColumn(TABLE, COLUMN, { transaction: t })
      await queryInterface.sequelize.query(
        `DROP TYPE IF EXISTS "${ENUM_NAME}"`,
        { transaction: t },
      )
    })
  },
}
