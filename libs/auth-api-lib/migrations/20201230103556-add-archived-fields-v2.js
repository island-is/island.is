'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('api_scope', 'archived', {
        type: Sequelize.DATE,
        allowNull: true,
      }),
      queryInterface.addColumn('identity_resource', 'archived', {
        type: Sequelize.DATE,
        allowNull: true,
      }),
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('api_scope', 'archived'),
      queryInterface.removeColumn('identity_resource', 'archived'),
    ])
  },
}
