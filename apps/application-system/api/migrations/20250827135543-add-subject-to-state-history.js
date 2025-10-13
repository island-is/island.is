'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface.addColumn(
          'state_history',
          'exit_event_subject_national_id',
          {
            type: Sequelize.STRING,
            allowNull: true,
          },
          { transaction: t },
        ),
        queryInterface.addColumn(
          'state_history',
          'exit_event_actor_national_id',
          {
            type: Sequelize.STRING,
            allowNull: true,
          },
          { transaction: t },
        ),
      ]),
    )
  },

  down: (queryInterface) => {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface.removeColumn(
          'state_history',
          'exit_event_subject_national_id',
        ),
        { transaction: t },
        queryInterface.removeColumn(
          'state_history',
          'exit_event_actor_national_id',
        ),
        { transaction: t },
      ]),
    )
  },
}
