'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface.renameColumn(
          'case',
          'accused_plea',
          'accused_plea_announcement',
          { transaction: t },
        ),
      ]),
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface.renameColumn(
          'case',
          'accused_plea_announcement',
          'accused_plea',
          { transaction: t },
        ),
      ]),
    )
  },
}
