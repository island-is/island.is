'use strict'

module.exports = {
  up: (queryInterface) => {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface.renameColumn(
        'case',
        'court_start_time',
        'court_start_date',
        { transaction: t },
      ),
    )
  },

  down: (queryInterface) => {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface.renameColumn(
        'case',
        'court_start_date',
        'court_start_time',
        { transaction: t },
      ),
    )
  },
}
