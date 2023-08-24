'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((transaction) =>
      Promise.all([
        queryInterface.addColumn(
          'case',
          'prosecutor_statement_date',
          { type: Sequelize.DATE, allowNull: true },
          { transaction },
        ),
        queryInterface.addColumn(
          'case',
          'defendant_statement_date',
          { type: Sequelize.DATE, allowNull: true },
          { transaction },
        ),
      ]),
    )
  },

  async down(queryInterface) {
    return queryInterface.sequelize.transaction((transaction) =>
      Promise.all([
        queryInterface.removeColumn('case', 'prosecutor_statement_date', {
          transaction,
        }),
        queryInterface.removeColumn('case', 'defendant_statement_date', {
          transaction,
        }),
      ]),
    )
  },
}
