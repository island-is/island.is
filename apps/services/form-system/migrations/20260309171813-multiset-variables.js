'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.renameColumn('screen', 'multiset', 'multi_max', {
        transaction: t,
      })

      await queryInterface.addColumn(
        'screen',
        'is_multi',
        {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
        { transaction: t },
      )
    })
  },

  async down(queryInterface) {
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.removeColumn('screen', 'is_multi', {
        transaction: t,
      })

      await queryInterface.renameColumn('screen', 'multi_max', 'multiset', {
        transaction: t,
      })
    })
  },
}
