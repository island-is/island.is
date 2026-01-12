'use strict'

module.exports = {
  async up(queryInterface) {
    return queryInterface.sequelize.transaction((transaction) =>
      Promise.all([
        queryInterface.removeColumn('indictment_count', 'deprecated_offenses', {
          transaction,
        }),
        queryInterface.removeColumn('indictment_count', 'substances', {
          transaction,
        }),
      ]),
    )
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((transaction) =>
      Promise.all([
        queryInterface.addColumn(
          'indictment_count',
          'deprecated_offenses',
          { type: Sequelize.JSONB, allowNull: true },
          { transaction },
        ),
        queryInterface.addColumn(
          'indictment_count',
          'substances',
          { type: Sequelize.JSONB, allowNull: true },
          { transaction },
        ),
      ]),
    )
  },
}
