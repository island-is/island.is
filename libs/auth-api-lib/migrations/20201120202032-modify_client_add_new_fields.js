'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('client', 'national_id', {
        type: Sequelize.STRING,
        allowNull: true,
      }),
      queryInterface.addColumn('client', 'client_type', {
        type: Sequelize.STRING,
        allowNull: true,
      }),
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('client', 'national_id'),
      queryInterface.removeColumn('client', 'client_type'),
    ])
  },
}
