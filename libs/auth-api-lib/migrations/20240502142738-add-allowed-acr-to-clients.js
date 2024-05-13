'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    queryInterface.addColumn('client', 'allowed_acr', {
      type: Sequelize.ARRAY(Sequelize.STRING),
      defaultValue: ['eidas-loa-high'],
      allowNull: false,
    })
  },

  async down(queryInterface) {
    queryInterface.removeColumn('client', 'allowed_acr')
  },
}
