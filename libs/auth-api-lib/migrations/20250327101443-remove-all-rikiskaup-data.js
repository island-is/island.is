'use strict'

module.exports = {
  async down() {
    throw new Error('This migration is irreversible')
  },

  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      const v_domain_name = '@rikiskaup.is'

      console.log(`🚨 DELETION STARTED for domain: ${v_domain_name} 🚨`)

      // 1. Clients
      const clients = await queryInterface.sequelize.query(
        `SELECT client_id FROM client WHERE domain_name = :domainName`,
        {
          type: Sequelize.QueryTypes.SELECT,
          replacements: { domainName: v_domain_name },
          transaction,
        },
      )

      for (const client of clients) {
        const clientId = client.client_id
        console.log(`\n💥 Deleting data for client: ${clientId}`)

        const relatedClientTables = [
          'client_delegation_types',
          'client_allowed_scope',
          'client_claim',
          'client_grant_type',
          'client_post_logout_redirect_uri',
          'client_secret',
        ]

        for (const table of relatedClientTables) {
          const rows = await queryInterface.sequelize.query(
            `DELETE FROM ${table} WHERE client_id = :clientId RETURNING *`,
            {
              type: Sequelize.QueryTypes.DELETE,
              replacements: { clientId },
              transaction,
            },
          )
          console.log(`🧹 Deleted ${rows.length} rows from ${table}`)
        }

        const deletedClient = await queryInterface.sequelize.query(
          `DELETE FROM client WHERE client_id = :clientId RETURNING *`,
          {
            type: Sequelize.QueryTypes.DELETE,
            replacements: { clientId },
            transaction,
          },
        )
        console.log(`🗑️ Deleted client row: ${clientId}`)
      }

      // 2. API Scopes
      const apiScopes = await queryInterface.sequelize.query(
        `SELECT name FROM api_scope WHERE domain_name = :domainName`,
        {
          type: Sequelize.QueryTypes.SELECT,
          replacements: { domainName: v_domain_name },
          transaction,
        },
      )

      for (const scope of apiScopes) {
        const scopeName = scope.name
        console.log(`\n💥 Deleting data for API scope: ${scopeName}`)

        // Delete from delegation_scope and collect delegation_ids
        const delegationScopeRows = await queryInterface.sequelize.query(
          `DELETE FROM delegation_scope WHERE scope_name = :scopeName RETURNING delegation_id`,
          {
            type: Sequelize.QueryTypes.DELETE,
            replacements: { scopeName },
            transaction,
          },
        )
        console.log(
          `🧹 Deleted ${delegationScopeRows.length} rows from delegation_scope`,
        )

        const relatedApiTables = [
          { table: 'api_scope_user_access', column: 'scope' },
          { table: 'api_scope_user_claim', column: 'api_scope_name' },
          { table: 'api_scope_delegation_types', column: 'api_scope_name' },
        ]

        for (const { table, column } of relatedApiTables) {
          const rows = await queryInterface.sequelize.query(
            `DELETE FROM ${table} WHERE ${column} = :scopeName RETURNING *`,
            {
              type: Sequelize.QueryTypes.DELETE,
              replacements: { scopeName },
              transaction,
            },
          )
          console.log(`🧹 Deleted ${rows.length} rows from ${table}`)
        }

        await queryInterface.sequelize.query(
          `DELETE FROM api_scope WHERE name = :scopeName RETURNING *`,
          {
            type: Sequelize.QueryTypes.DELETE,
            replacements: { scopeName },
            transaction,
          },
        )
        console.log(`🗑️ Deleted API scope: ${scopeName}`)
      }

      // 3. Delegations (just in case any remain)
      const deletedDelegations = await queryInterface.sequelize.query(
        `DELETE FROM delegation WHERE domain_name = :domainName RETURNING *`,
        {
          type: Sequelize.QueryTypes.DELETE,
          replacements: { domainName: v_domain_name },
          transaction,
        },
      )
      console.log(`\n⚖️ Deleted ${deletedDelegations.length} delegations`)

      // 4. Domain
      const deletedDomain = await queryInterface.sequelize.query(
        `DELETE FROM domain WHERE name = :domainName RETURNING *`,
        {
          type: Sequelize.QueryTypes.DELETE,
          replacements: { domainName: v_domain_name },
          transaction,
        },
      )

      if (deletedDomain.length > 0) {
        console.log(`🏁 Deleted domain: ${v_domain_name}`)
      } else {
        console.log(`❌ Domain not found: ${v_domain_name}`)
      }

      console.log(`\n✅ DELETION COMPLETE for domain: ${v_domain_name}`)
    })
  },
}
