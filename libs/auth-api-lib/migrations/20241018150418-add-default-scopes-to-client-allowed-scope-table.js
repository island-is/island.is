'use strict'
const DEFAULT_SCOPES = ['email', 'address', 'phone']

module.exports = {
  async up(queryInterface, Sequelize) {
    const clients = await queryInterface.sequelize.query(
      `SELECT "client_id" FROM "client" WHERE "client_type" IN (:clientTypes);`,
      {
        type: queryInterface.sequelize.QueryTypes.SELECT,
        replacements: { clientTypes: ['web', 'native', 'spa'] },
      },
    )
    const clientIds = clients.map((client) => client.client_id)

    if (!clientIds.length) {
      return
    }

    const existingScopes = await queryInterface.sequelize.query(
      `SELECT "client_id", "scope_name" FROM "client_allowed_scope" WHERE "client_id" IN (:clientIds);`,
      {
        type: queryInterface.sequelize.QueryTypes.SELECT,
        replacements: { clientIds },
      },
    )

    const existingScopesLookup = new Set(
      existingScopes.map((scope) => `${scope.client_id}-${scope.scope_name}`),
    )

    const rows = []

    for (const clientId of clientIds) {
      rows.push(
        ...DEFAULT_SCOPES.filter((scope) => {
          return !existingScopesLookup.has(`${clientId}-${scope}`)
        }).map((scope) => ({ client_id: clientId, scope_name: scope })),
      )
    }

    if (!rows.length) {
      return
    }

    await queryInterface.bulkInsert('client_allowed_scope', rows)
  },

  async down(queryInterface, Sequelize) {
    /**
     * There is no need to go back
     *
     */
  },
}
