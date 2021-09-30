'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('endorsement_list', 'counter', {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('endorsement_list', 'counter')
  },
}
