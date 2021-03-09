'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface.addColumn('application', 'completed', {
          type: Sequelize.BOOLEAN,
          defaultValue: false,
          allowNull: false,
        }),
      ]),
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([queryInterface.removeColumn('application', 'completed')]),
    )
  },
}
