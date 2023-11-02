'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      // Define the new column on the table
      await queryInterface.addColumn(
        'api_scope',
        'custom_delegation_only_for',
        {
          type: Sequelize.ARRAY(Sequelize.ENUM('ProcurationHolder', 'Custom')),
          allowNull: true,
          defaultValue: null,
        },
        { transaction },
      )

      // Migrate the currently configured rules that previously where configured in DelegationConfig
      // Migrate scopes that only allows 'ProcurationHolder'
      await queryInterface.sequelize.query(
        `UPDATE api_scope SET custom_delegation_only_for = ARRAY['ProcurationHolder'::enum_api_scope_custom_delegation_only_for] WHERE name in ('@island.is/auth/delegations:write', '@admin.island.is/delegations')`,
        { transaction },
      )

      // Migrate scopes that allow both 'ProcurationHolder' and 'Custom'
      await queryInterface.sequelize.query(
        `UPDATE api_scope SET custom_delegation_only_for = ARRAY['ProcurationHolder'::enum_api_scope_custom_delegation_only_for, 'Custom'::enum_api_scope_custom_delegation_only_for] WHERE name in ('@samradsgatt.island.is/samradsgatt', '@island.is/finance/salary', '@island.is/company', '@akureyri.is/service-portal')`,
        { transaction },
      )
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.removeColumn(
        'api_scope',
        'custom_delegation_only_for',
        { transaction },
      )
    })
  },
}
