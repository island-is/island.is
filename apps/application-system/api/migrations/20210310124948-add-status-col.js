'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface.addColumn(
          'application',
          'status',
          {
            type: Sequelize.ENUM('inprogress', 'completed', 'rejected'),
            defaultValue: 'inprogress',
            allowNull: false,
          },
          { transaction: t },
        ),
      ]),
    )
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface.removeColumn('application', 'status', {
          transaction: t,
        }),
      ]),
    )
  },
}
