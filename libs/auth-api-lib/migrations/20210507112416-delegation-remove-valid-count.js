'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('delegation', 'valid_count'),
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('delegation', 'valid_count', {
        type: Sequelize.INTEGER,
        allowNull: true,
      }),
    ])
  },
}
