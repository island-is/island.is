'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('api_resource', 'national_id', {
        type: Sequelize.STRING,
        allowNull: true,
      }),
      queryInterface.addColumn('api_resource', 'archived', {
        type: Sequelize.DATE,
        allowNull: true,
      }),
      queryInterface.addColumn('client', 'archived', {
        type: Sequelize.DATE,
        allowNull: true,
      }),
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('api_resource', 'national_id'),
      queryInterface.removeColumn('api_resource', 'archived'),
      queryInterface.removeColumn('client', 'archived'),
    ])
  },
}
