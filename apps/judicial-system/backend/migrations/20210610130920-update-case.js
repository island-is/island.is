'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface.addColumn(
          'case',
          'is_accused_absent',
          {
            type: Sequelize.BOOLEAN,
            allowNull: true,
          },
          { transaction: t },
        ),
        queryInterface.renameColumn(
          'case',
          'isolation_to',
          'isolation_to_date',
          { transaction: t },
        ),
      ]),
    )
  },

  down: (queryInterface) => {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface.removeColumn('case', 'is_accused_absent', {
          transaction: t,
        }),
        queryInterface.renameColumn(
          'case',
          'isolation_to_date',
          'isolation_to',
          { transaction: t },
        ),
      ]),
    )
  },
}
