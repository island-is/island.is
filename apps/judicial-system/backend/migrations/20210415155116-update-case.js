'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface.addColumn(
          'case',
          'accused_postponed_appeal_date',
          {
            type: Sequelize.DATE,
            allowNull: true,
          },
          { transaction: t },
        ),
        queryInterface.addColumn(
          'case',
          'prosecutor_postponed_appeal_date',
          {
            type: Sequelize.DATE,
            allowNull: true,
          },
          { transaction: t },
        ),
      ]),
    )
  },

  down: (queryInterface) => {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface.removeColumn('case', 'accused_postponed_appeal_date', {
          transaction: t,
        }),
        queryInterface.removeColumn(
          'case',
          'prosecutor_postponed_appeal_date',
          {
            transaction: t,
          },
        ),
      ]),
    )
  },
}
