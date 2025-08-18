'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('user_profile', 'email_notifications', {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    })
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('user_profile', 'email_notifications')
  },
}
