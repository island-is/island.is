'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('api_scope', 'is_access_controlled', {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      }),
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('api_scope', 'is_access_controlled'),
    ])
  },
}
