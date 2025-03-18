'use strict'

module.exports = {
  async up(queryInterface) {
    return queryInterface.sequelize.transaction((transaction) =>
      queryInterface.removeColumn('indictment_count', 'deprecated_offenses', {
        transaction,
      }),
    )
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((transaction) =>
      queryInterface.addColumn(
        'indictment_count',
        'deprecated_offenses',
        { type: Sequelize.JSONB, allowNull: true },
        { transaction },
      ),
    )
  },
}
