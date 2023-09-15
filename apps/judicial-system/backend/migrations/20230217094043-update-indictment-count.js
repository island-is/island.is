'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((transaction) =>
      queryInterface.addColumn(
        'indictment_count',
        'substances',
        { type: Sequelize.JSONB, allowNull: true },
        { transaction },
      ),
    )
  },

  async down(queryInterface) {
    return queryInterface.sequelize.transaction((transaction) =>
      queryInterface.removeColumn('indictment_count', 'substances', {
        transaction,
      }),
    )
  },
}
