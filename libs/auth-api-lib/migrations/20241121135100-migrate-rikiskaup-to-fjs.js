'use strict'

const { uuid } = require('uuidv4')

module.exports = {
  up: (queryInterface, Sequelize) => {
    // We prefer doing delegation duplication to the new FJS scope to avoid
    // any downtime for users while FJS updates the clientId.

    return queryInterface.sequelize.transaction(async (transaction) => {
      const [rikiskaupDelegations, _ignore] =
        await queryInterface.sequelize.query(
          `
          SELECT d.*, ds.*, d.created as created, d.modified as modified, ds.created as scope_created, ds.modified as scope_modified
          FROM delegation d
          JOIN delegation_scope ds ON d.id = ds.delegation_id
          WHERE d.domain_name = '@rikiskaup.is'
            AND ds.scope_name = '@rikiskaup.is/gagnaskilagatt'
        `,
          { transaction },
        )

      const fjsDelegations = rikiskaupDelegations.map((delegation) => ({
        id: uuid(),
        from_national_id: delegation.from_national_id,
        from_display_name: delegation.from_display_name,
        to_national_id: delegation.to_national_id,
        to_name: delegation.to_name,
        created_by_national_id: delegation.created_by_national_id,
        domain_name: '@fjs.is',
        created: delegation.created,
        modified: delegation.modified,
      }))

      const fjsDelegationScopes = fjsDelegations.map((delegation, index) => ({
        id: uuid(),
        delegation_id: delegation.id,
        scope_name: '@fjs.is/rammasamningar',
        created: rikiskaupDelegations[index].scope_created,
        modified: rikiskaupDelegations[index].scope_modified,
      }))

      console.log(
        `Found ${rikiskaupDelegations.length} delegations to duplicate`,
        {
          rikiskaupDelegations: rikiskaupDelegations.map((d) => d.id),
          fjsDelegations: fjsDelegations.map((d) => d.id),
          fjsDelegationScopes: fjsDelegationScopes.map((d) => ({
            id: d.id,
            delegationId: d.delegation_id,
          })),
        },
      )

      console.log('Inserting new FJS delegations')
      await queryInterface.bulkInsert('delegation', fjsDelegations, {
        transaction,
      })

      console.log('Inserting new FJS delegation scopes')
      await queryInterface.bulkInsert('delegation_scope', fjsDelegationScopes, {
        transaction,
      })

      console.log('Done duplicating to FJS delegations')
    })
  },

  down: () => {
    // it's impossible to know which delegations were granted by users before or after the migration
    // thus it's impossible to revert the migration
  },
}
