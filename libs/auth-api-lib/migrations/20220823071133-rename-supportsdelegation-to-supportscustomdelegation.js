'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    queryInterface.renameColumn(
      'client',
      'supports_delegation',
      'supports_custom_delegation',
    )
  },

  async down(queryInterface, Sequelize) {
    queryInterface.renameColumn(
      'client',
      'supports_custom_delegation',
      'supports_delegation',
    )
  },
}
