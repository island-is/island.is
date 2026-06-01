'use strict'

const TABLE = 'bank_transfer_payment'
const COLUMN = 'expires_at'

module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.addColumn(TABLE, COLUMN, {
      type: Sequelize.DATE,
      allowNull: false,
    }),

  down: (queryInterface) => queryInterface.removeColumn(TABLE, COLUMN),
}
