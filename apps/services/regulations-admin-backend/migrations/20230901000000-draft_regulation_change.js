'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface.changeColumn(
          'draft_regulation_change',
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
          'draft_regulation_change',
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
