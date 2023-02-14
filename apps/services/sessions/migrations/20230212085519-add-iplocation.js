'use strict'

module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.addColumn('session', 'ip_location', {
      type: Sequelize.STRING,
      allowNull: true,
    })
  },

  down(queryInterface) {
    return queryInterface.removeColumn('session', 'ip_location')
  },
}
