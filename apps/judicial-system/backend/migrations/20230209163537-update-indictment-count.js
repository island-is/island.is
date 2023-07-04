'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface.addColumn(
        'indictment_count',
        'laws_broken',
        { type: Sequelize.JSONB, allowNull: true },
        { transaction: t },
      ),
    )
  },

  async down(queryInterface) {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface.removeColumn('indictment_count', 'laws_broken', {
        transaction: t,
      }),
    )
  },
}
