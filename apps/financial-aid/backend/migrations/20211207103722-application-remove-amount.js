'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface.removeColumn('applications', 'amount', {
          transaction: t,
        }),
      ]),
    )
  },

  down: (queryInterface, Sequelize) => {
    Promise.all([
      queryInterface.addColumn(
        'applications',
        'amount',
        {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        { transaction: t },
      )
    ])
  },
}
