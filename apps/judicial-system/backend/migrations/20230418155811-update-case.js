'use strict'

module.exports = {
  up: (queryInterface) => {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface.renameColumn(
          'case',
          'court_received_appeal_date',
          'appeal_received_by_court_date',
          { transaction: t },
        ),
      ]),
    )
  },

  down: (queryInterface) => {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface.renameColumn(
          'case',
          'appeal_received_by_court_date',
          'court_received_appeal_date',
          { transaction: t },
        ),
      ]),
    )
  },
}
