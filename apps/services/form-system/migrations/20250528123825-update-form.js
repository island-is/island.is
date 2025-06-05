'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('form', 'allowed_delegation_types', {
      type: Sequelize.JSONB,
      allowNull: false,
      defaultValue: [],
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('form', 'allowed_delegation_types')
  },
}
