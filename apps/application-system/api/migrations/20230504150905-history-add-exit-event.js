'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface.addColumn('state_history', 'exit_event', {
          type: Sequelize.STRING,
          allowNull: true,
        }),
        queryInterface.addColumn('state_history', 'previous_state', {
          type: Sequelize.UUID,
          allowNull: true,
        }),
      ]),
    )
  },

  down: (queryInterface) => {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface.removeColumn('state_history', 'exit_event'),
        queryInterface.removeColumn('state_history', 'previous_state'),
      ]),
    )
  },
}
