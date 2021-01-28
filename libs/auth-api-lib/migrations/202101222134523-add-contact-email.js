'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('client', 'contact_email', {
        type: Sequelize.STRING,
        allowNull: true,
      }),
      queryInterface.addColumn('api_resource', 'contact_email', {
        type: Sequelize.STRING,
        allowNull: true,
      }),
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('client', 'contact_email'),
      queryInterface.removeColumn('api_resource', 'contact_email'),
    ])
  },
}
