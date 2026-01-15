'use strict'

module.exports = {
  // Data already migrated as part of this PR: https://github.com/island-is/island.is/issues/19578
  up: (queryInterface) => {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface.removeColumn('defendant', 'service_requirement', {
          transaction: t,
        }),
        queryInterface.removeColumn('defendant', 'verdict_view_date', {
          transaction: t,
        }),
        queryInterface.removeColumn('defendant', 'verdict_appeal_date', {
          transaction: t,
        }),
        queryInterface.removeColumn('defendant', 'verdict_appeal_decision', {
          transaction: t,
        }),
        queryInterface.removeColumn('defendant', 'information_for_defendant', {
          transaction: t,
        }),
      ]),
    )
  },
  down: () => {
    return Promise.resolve()
  },
}
