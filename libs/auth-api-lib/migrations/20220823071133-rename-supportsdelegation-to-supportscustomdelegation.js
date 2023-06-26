'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('client', 'supports_custom_delegation', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    })

    await queryInterface.sequelize.query(`
      UPDATE client SET supports_custom_delegation = supports_delegation
    `)
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('client', 'supports_custom_delegation')
  },
}
