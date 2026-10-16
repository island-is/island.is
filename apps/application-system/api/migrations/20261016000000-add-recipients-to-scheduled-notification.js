'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('scheduled_notification', 'recipients', {
      type: Sequelize.JSONB,
      allowNull: true,
    })
  },

  down: (queryInterface) => {
    return queryInterface.removeColumn('scheduled_notification', 'recipients')
  },
}
