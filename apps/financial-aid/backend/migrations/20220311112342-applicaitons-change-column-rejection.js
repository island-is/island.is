'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface.changeColumn(
          'applications',
          'rejection',
          {
            type: Sequelize.TEXT,
          },
          { transaction: t },
        ),
        queryInterface.changeColumn(
          'application_events',
          'comment',
          {
            type: Sequelize.TEXT,
          },
          { transaction: t },
        ),
      ]),
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface.changeColumn(
          'applications',
          'rejection',
          {
            type: Sequelize.STRING,
          },
          { transaction: t },
        ),
        queryInterface.changeColumn(
          'application_events',
          'comment',
          {
            type: Sequelize.STRING,
          },
          { transaction: t },
        ),
      ]),
    )
  },
}
