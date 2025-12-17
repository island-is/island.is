'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('user_notification', 'scope', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: '@island.is/documents',
    })
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('user_notification', 'scope')
  },
}
