'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('form', 'has_summary_screen', {
      type: Sequelize.BOOLEAN,
      allowNull: true,
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('form', 'has_summary_screen')
  },
}
