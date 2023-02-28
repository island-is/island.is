'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((transaction) =>
      Promise.all([
        queryInterface.addColumn(
          'indictment_count',
          'offenses',
          { type: Sequelize.JSONB, allowNull: true },
          { transaction },
        ),
      ]),
    )
  },

  async down(queryInterface) {
    return queryInterface.sequelize.transaction((transaction) =>
      Promise.all([
        queryInterface.removeColumn('indictment_count', 'offenses', {
          transaction,
        }),
      ]),
    )
  },
}
