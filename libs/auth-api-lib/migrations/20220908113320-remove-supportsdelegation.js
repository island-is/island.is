'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn('client', 'supports_delegation')
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn('client', 'supports_delegation', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    })

    await queryInterface.sequelize.query(`
      UPDATE client SET supports_delegation = supports_custom_delegation
    `)
  },
}
