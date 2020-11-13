'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('user', 'active', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('user', 'active')
  },
}
