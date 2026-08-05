'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('scheduled_notification', 'args', {
      type: Sequelize.JSONB,
      allowNull: true,
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('scheduled_notification', 'args')
  },
}
