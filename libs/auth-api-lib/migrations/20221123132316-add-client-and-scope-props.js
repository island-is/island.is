'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.addColumn(
        'client',
        'require_api_scopes',
        {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
        { transaction },
      )

      await queryInterface.addColumn(
        'api_scope',
        'grant_to_authenticated_user',
        {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: true,
        },
        { transaction },
      )
    })
  },

  async down(queryInterface) {
    return queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.removeColumn('client', 'require_api_scopes', {
        transaction,
      })
      await queryInterface.removeColumn(
        'api_scope',
        'grant_to_authenticated_user',
        {
          transaction,
        },
      )
    })
  },
}
