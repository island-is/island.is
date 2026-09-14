'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((transaction) =>
      queryInterface.addColumn(
        'case',
        'is_arraignment_summons_skipped',
        {
          type: Sequelize.BOOLEAN,
          allowNull: true,
        },
        { transaction },
      ),
    )
  },

  async down(queryInterface) {
    return queryInterface.sequelize.transaction((transaction) =>
      queryInterface.removeColumn('case', 'is_arraignment_summons_skipped', {
        transaction,
      }),
    )
  },
}
