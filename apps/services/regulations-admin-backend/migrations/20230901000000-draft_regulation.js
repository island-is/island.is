'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface.changeColumn(
          'draft_regulation',
          'title',
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
          'draft_regulation',
          'title',
          {
            type: Sequelize.STRING,
          },
          { transaction: t },
        ),
      ]),
    )
  },
}
