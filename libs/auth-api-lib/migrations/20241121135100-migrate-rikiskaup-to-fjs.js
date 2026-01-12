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
          SELECT d.*, ds.*, d.id as id, d.created as created, d.modified as modified, ds.id as scope_id, ds.created as scope_created, ds.modified as scope_modified
          FROM delegation d
          JOIN delegation_scope ds ON d.id = ds.delegation_id
          WHERE d.domain_name = '@rikiskaup.is'
            AND ds.scope_name = '@rikiskaup.is/gagnaskilagatt'
        `,
          { transaction },
        )

      const [fjsDelegations, _ignore2] = await queryInterface.sequelize.query(
        `
          SELECT d.*, ds.*,  d.id as id, d.created as created, d.modified as modified, ds.id as scope_id, ds.created as scope_created, ds.modified as scope_modified
          FROM delegation d
          LEFT JOIN delegation_scope ds ON d.id = ds.delegation_id
          WHERE d.domain_name = '@fjs.is'
        `,
        { transaction },
      )

      const newFjsDelegations = []
      const newFjsDelegationScopes = []

      rikiskaupDelegations.map((delegation) => {
        const existingFjsDelegation = fjsDelegations.find(
          (d) =>
            d.from_national_id === delegation.from_national_id &&
            d.to_national_id === delegation.to_national_id,
        )

        if (existingFjsDelegation) {
          console.log(
            `Delegation already exists in FJS, skipping delegation duplication`,
            {
              rikiskaupDelegation: delegation.id,
              fjsDelegation: existingFjsDelegation.id,
            },
          )

          const existingRammasamningarScope = fjsDelegations.find(
            (d) =>
              d.id === existingFjsDelegation.id &&
              d.scope_name === '@fjs.is/rammasamningar',
          )

          if (existingRammasamningarScope) {
            console.log(
              `Rammasamningar delegation scope already exists in FJS delegation scope, skipping delegation scope duplication`,
              {
                fjsDelegation: existingFjsDelegation.id,
                fjsDelegationScope: existingRammasamningarScope.scope_id,
              },
            )
          } else {
            newFjsDelegationScopes.push({
              id: uuid(),
              delegation_id: existingFjsDelegation.id,
              scope_name: '@fjs.is/rammasamningar',
              valid_to: delegation.valid_to,
              created: delegation.scope_created,
              modified: delegation.scope_modified,
            })
          }
        } else {
          const delegationId = uuid()
          newFjsDelegations.push({
            id: delegationId,
            from_national_id: delegation.from_national_id,
            from_display_name: delegation.from_display_name,
            to_national_id: delegation.to_national_id,
            to_name: delegation.to_name,
            created_by_national_id: delegation.created_by_national_id,
            domain_name: '@fjs.is',
            created: delegation.created,
            modified: delegation.modified,
          })
          newFjsDelegationScopes.push({
            id: uuid(),
            delegation_id: delegationId,
            scope_name: '@fjs.is/rammasamningar',
            valid_to: delegation.valid_to,
            created: delegation.scope_created,
            modified: delegation.scope_modified,
          })
        }
      })

      console.log(
        `Found ${newFjsDelegations.length} new FJS delegations to create`,
        {
          fjsDelegations: newFjsDelegations.map((d) => d.id),
        },
      )

      console.log(
        `Found ${newFjsDelegationScopes.length} new FJS delegation scopes to create`,
        {
          fjsDelegationScopes: newFjsDelegationScopes.map((d) => ({
            id: d.id,
            delegationId: d.delegation_id,
          })),
        },
      )

      if (newFjsDelegations.length > 0) {
        console.log('Inserting new FJS delegations')

        await queryInterface.bulkInsert('delegation', newFjsDelegations, {
          transaction,
        })
      }

      if (newFjsDelegationScopes.length > 0) {
        console.log('Inserting new FJS delegation scopes')
        await queryInterface.bulkInsert(
          'delegation_scope',
          newFjsDelegationScopes,
          {
            transaction,
          },
        )
      }

      console.log('Done duplicating to FJS delegations')
    })
  },

  down: () => {
    // it's impossible to know which delegations were granted by users before or after the migration
    // thus it's impossible to revert the migration
  },
}
