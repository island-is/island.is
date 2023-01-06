'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('api_scope_user', 'name', {
        type: Sequelize.STRING,
        allowNull: true,
      }),
    ])
  },

  down: (queryInterface) => {
    return Promise.all([queryInterface.removeColumn('api_scope_user', 'name')])
  },
}
