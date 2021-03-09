'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('grant_type', 'archived', {
      type: Sequelize.DATE,
      allowNull: true,
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('grant_type', 'archived')
  },
}
