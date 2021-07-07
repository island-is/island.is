'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface.changeColumn('applications', 'state', {
          type: Sequelize.TEXT,
        }),
      ]),
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface.sequelize
          .query('drop type state', { transaction: t })
          .then(() =>
            queryInterface.changeColumn('applications', 'state', {
              type: Sequelize.ENUM(
                'New',
                'InProgress',
                'DataNeeded',
                'Rejected',
                'Approved',
              ),
            }),
          ),
      ]),
    )
  },
}
