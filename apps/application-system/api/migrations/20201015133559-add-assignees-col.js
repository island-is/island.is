'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface.removeColumn('application', 'assignee'),
        queryInterface.addColumn('application', 'assignees', {
          type: Sequelize.ARRAY(Sequelize.STRING),
          defaultValue: [],
          allowNull: false,
        }),
      ]),
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface.removeColumn('application', 'assignees'),
        queryInterface.addColumn('application', 'assignee', Sequelize.STRING),
      ]),
    )
  },
}
