'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface.changeColumn(
          'applications',
          'home_circumstances_custom',
          {
            type: Sequelize.TEXT,
          },
          { transaction: t },
        ),
        queryInterface.changeColumn(
          'applications',
          'employment_custom',
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
          'home_circumstances_custom',
          {
            type: Sequelize.STRING,
          },
          { transaction: t },
        ),
        queryInterface.changeColumn(
          'applications',
          'employment_custom',
          {
            type: Sequelize.STRING,
          },
          { transaction: t },
        ),
      ]),
    )
  },
}
