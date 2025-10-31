'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.renameColumn(
      'form',
      'application_days_to_remove',
      'days_until_application_prune',
    )
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.renameColumn(
      'form',
      'days_until_application_prune',
      'application_days_to_remove',
    )
  },
}
