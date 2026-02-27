'use strict'

const { QueryTypes } = require('sequelize')

/**
 * Sequelize migration:
 * - Deletes api_scope '@admin.island.is/application-system' after handling FK references.
 * - Deletes referencing rows in:
 *   - api_scope_delegation_types
 *   - api_scope_user_access
 *   - api_scope_user_claim
 *   - personal_representative_scope_permission
 * - Migrates delegation_scope.scope_name references to '@admin.island.is/application-system:admin'
 *   - Includes a guard that the target scope exists.
 *
 * Notes:
 * - Uses a single transaction.
 * - Uses parameterized queries to avoid SQL injection.
 */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const OLD_SCOPE = '@admin.island.is/application-system'
    const NEW_SCOPE = '@admin.island.is/application-system:admin'

    await queryInterface.sequelize.transaction(async (transaction) => {
      // Ensure the old scope exists; if not, no-op (idempotent)
      const oldScope = await queryInterface.sequelize.query(
        `SELECT name FROM api_scope WHERE name = :oldScope LIMIT 1`,
        {
          transaction,
          replacements: { oldScope: OLD_SCOPE },
          type: QueryTypes.SELECT,
        },
      )

      if (!oldScope || oldScope.length === 0) {
        return
      }

      // Delete dependent rows (NO ACTION FKs)
      await queryInterface.sequelize.query(
        `DELETE FROM api_scope_delegation_types WHERE api_scope_name = :oldScope`,
        { transaction, replacements: { oldScope: OLD_SCOPE } },
      )

      await queryInterface.sequelize.query(
        `DELETE FROM api_scope_user_access WHERE scope = :oldScope`,
        { transaction, replacements: { oldScope: OLD_SCOPE } },
      )

      await queryInterface.sequelize.query(
        `DELETE FROM api_scope_user_claim WHERE api_scope_name = :oldScope`,
        { transaction, replacements: { oldScope: OLD_SCOPE } },
      )

      await queryInterface.sequelize.query(
        `DELETE FROM personal_representative_scope_permission WHERE api_scope_name = :oldScope`,
        { transaction, replacements: { oldScope: OLD_SCOPE } },
      )

      // Only if there are delegation_scope rows to migrate, verify NEW_SCOPE exists, then migrate.
      const delegationToMigrate = await queryInterface.sequelize.query(
        `SELECT 1 FROM delegation_scope WHERE scope_name = :oldScope LIMIT 1`,
        {
          transaction,
          replacements: { oldScope: OLD_SCOPE },
          type: QueryTypes.SELECT,
        },
      )

      if (delegationToMigrate && delegationToMigrate.length > 0) {
        const newScope = await queryInterface.sequelize.query(
          `SELECT name FROM api_scope WHERE name = :newScope LIMIT 1`,
          {
            transaction,
            replacements: { newScope: NEW_SCOPE },
            type: QueryTypes.SELECT,
          },
        )

        if (!newScope || newScope.length === 0) {
          throw new Error(
            `Migration aborted: target scope '${NEW_SCOPE}' does not exist in api_scope, but delegation_scope rows need migration from '${OLD_SCOPE}'.`,
          )
        }

        await queryInterface.sequelize.query(
          `UPDATE delegation_scope SET scope_name = :newScope WHERE scope_name = :oldScope`,
          {
            transaction,
            replacements: { oldScope: OLD_SCOPE, newScope: NEW_SCOPE },
          },
        )
      }

      // Finally delete the api_scope row itself
      await queryInterface.sequelize.query(
        `DELETE FROM api_scope WHERE name = :oldScope`,
        { transaction, replacements: { oldScope: OLD_SCOPE } },
      )
    })
  },

  down: async () => {
    // Down migration left empty as it's impossible to know the full state of deleted data,
    // and restoring it could cause data integrity issues.
  },
}
