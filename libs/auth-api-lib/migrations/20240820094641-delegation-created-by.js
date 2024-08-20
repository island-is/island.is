'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn('delegation', 'created_by_national_id', {
        type: Sequelize.STRING,
        allowNull: true,
      }),
    ])
  },

  async down(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn('delegation', 'created_by_national_id'),
    ])
  },
}
