'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn('payment', 'expires_at')
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn('payment', 'expires_at', {
      type: Sequelize.DATE,
      allowNull: false,
    })
  },
}
