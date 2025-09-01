'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface.addColumn('state_history', 'exit_event_subject_national_id', {
          type: Sequelize.STRING,
          allowNull: true,
        }),
        queryInterface.addColumn('state_history', 'exit_event_actor_national_id', {
          type: Sequelize.STRING,
          allowNull: true,
        }),
      ]),
    )
  },

  down: (queryInterface) => {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface.removeColumn('state_history', 'exit_event_subject_national_id'),
        queryInterface.removeColumn('state_history', 'exit_event_actor_national_id'),
      ]),
    )
  },
}
