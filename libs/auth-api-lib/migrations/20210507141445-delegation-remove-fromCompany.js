'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('delegation', 'is_from_company'),
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('delegation', 'is_from_company', {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      }),
    ])
  },
}
