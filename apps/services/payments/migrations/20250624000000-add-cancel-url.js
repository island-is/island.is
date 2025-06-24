'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('payment_flow', 'cancel_url', {
      type: Sequelize.STRING,
      allowNull: true,
    })
  },

  down: (queryInterface) => {
    return queryInterface.removeColumn('payment_flow', 'cancel_url')
  },
}
