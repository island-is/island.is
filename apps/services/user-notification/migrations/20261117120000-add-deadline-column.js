'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    // Sequelize.DATE is "timestamp with time zone" on Postgres
    await queryInterface.addColumn('user_notification', 'deadline', {
      type: Sequelize.DATE,
      allowNull: true,
    })
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('user_notification', 'deadline')
  },
}
