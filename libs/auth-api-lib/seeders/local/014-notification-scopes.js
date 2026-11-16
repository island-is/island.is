'use strict'

/**
 * Seeds the scopes user-profile asks the delegation index about.
 *
 * user-profile sends every scope in `notificationScopes`
 * (libs/auth/scopes/src/lib/clients/notification-scopes.ts) to
 * GET /v1/delegations, and the delegation API rejects the whole request with
 * "Invalid scope(s)" if any of them is missing from `api_scope`. Keep this
 * seeder in sync with that list.
 *
 * @island.is/documents is already created in 004-island.is.client.js.
 */

const scopes = [
  {
    name: '@island.is/applications/samgongustofa-vehicles',
    displayName: 'Ökutæki',
  },
  { name: '@island.is/health', displayName: 'Heilsa' },
]

const toApiScopeRow = (scope) => ({
  enabled: true,
  name: scope.name,
  display_name: scope.displayName,
  description: null,
  show_in_discovery_document: false,
  required: false,
  emphasize: false,
  grant_to_legal_guardians: true,
  grant_to_procuring_holders: true,
  allow_explicit_delegation_grant: true,
  also_for_delegated_user: false,
  automatic_delegation_grant: false,
  is_access_controlled: false,
  domain_name: '@island.is',
})

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Skip scopes that already exist, e.g. on a database restored from a dump.
    const existing = await queryInterface.sequelize.query(
      `SELECT name FROM api_scope WHERE name IN (:names)`,
      {
        type: Sequelize.QueryTypes.SELECT,
        replacements: { names: scopes.map((s) => s.name) },
      },
    )
    const existingNames = new Set(existing.map((row) => row.name))
    const missing = scopes.filter((s) => !existingNames.has(s.name))

    if (missing.length > 0) {
      await queryInterface.bulkInsert('api_scope', missing.map(toApiScopeRow))
    }
  },

  down: async () => {
    // Do nothing
  },
}
