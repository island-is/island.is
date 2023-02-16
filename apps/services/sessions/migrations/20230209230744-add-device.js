'use strict'

module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.addColumn('session', 'device', {
      type: Sequelize.STRING,
      allowNull: true,
    })
  },

  down(queryInterface) {
    return queryInterface.removeColumn('session', 'device')
  },
}
