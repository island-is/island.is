'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.addColumn(
        'api_scope',
        'order',
        {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0,
          validate: {
            min: 0,
            max: 999,
          },
        },
        { transaction },
      )
      await queryInterface.addColumn(
        'api_scope_group',
        'order',
        {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0,
          validate: {
            min: 0,
            max: 999,
          },
        },
        { transaction },
      )
    })
  },

  async down(queryInterface) {
    return queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.removeColumn('api_scope', 'order', { transaction })
      await queryInterface.removeColumn('api_scope_group', 'order', {
        transaction,
      })
    })
  },
}
