'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('email_verification', 'tries', {
      type: Sequelize.INTEGER,
      defaultValue: 0,
      allowNull: false,
    })
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('email_verification', 'tries')
  },
}
