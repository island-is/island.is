'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface.addColumn('application', 'draft_finished_steps', {
          type: Sequelize.INTEGER,
          defaultValue: 0,
          allowNull: false,
        }),
        queryInterface.addColumn('application', 'draft_total_steps', {
          type: Sequelize.INTEGER,
          defaultValue: 0,
          allowNull: false,
        }),
      ]),
    )
  },

  down: (queryInterface) => {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface.removeColumn('application', 'draft_finished_steps'),
        queryInterface.removeColumn('application', 'draft_total_steps'),
      ]),
    )
  },
}
