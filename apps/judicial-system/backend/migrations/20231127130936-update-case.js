'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((transaction) =>
      Promise.all([
        queryInterface.addColumn(
          'case',
          'appeal_valid_to_date',
          { type: Sequelize.DATE, allowNull: true },
          { transaction },
        ),
        queryInterface.addColumn(
          'case',
          'is_appeal_custody_isolation',
          {
            type: Sequelize.BOOLEAN,
            allowNull: true,
          },
          { transaction },
        ),
        queryInterface.addColumn(
          'case',
          'appeal_isolation_to_date',
          { type: Sequelize.DATE, allowNull: true },
          { transaction },
        ),
      ]),
    )
  },

  async down(queryInterface) {
    return queryInterface.sequelize.transaction((transaction) =>
      Promise.all([
        queryInterface.removeColumn('case', 'appeal_valid_to_date', {
          transaction,
        }),
        queryInterface.removeColumn('case', 'is_appeal_custody_isolation', {
          transaction,
        }),
        queryInterface.removeColumn('case', 'appeal_isolation_to_date', {
          transaction,
        }),
      ]),
    )
  },
}
