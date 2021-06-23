'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface.addColumn(
          'applications',
          'state',
          {
            type: Sequelize.ENUM('New', 'InProgress', 'Rejected', 'Approved'),
            allowNull: false,
            defaultValue: 'New',
          },
          { transaction: t },
        ),
      ]),
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface.removeColumn('applications', 'state', {
          transaction: t,
        }),
      ]),
    )
  },
}
