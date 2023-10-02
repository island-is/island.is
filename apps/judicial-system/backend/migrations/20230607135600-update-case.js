'use strict'

module.exports = {
  up: (queryInterface) => {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface.renameColumn(
        'case',
        'seen_by_defender',
        'opened_by_defender',
        { transaction: t },
      ),
    )
  },

  down: (queryInterface) => {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface.renameColumn(
        'case',
        'opened_by_defender',
        'seen_by_defender',
        { transaction: t },
      ),
    )
  },
}
