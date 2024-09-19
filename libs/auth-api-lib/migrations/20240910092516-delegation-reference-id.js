'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn('delegation', 'reference_id', {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true,
      }),
    ])
  },

  async down(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn('delegation', 'reference_id'),
    ])
  },
}
