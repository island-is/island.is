'use strict'

const { QueryTypes } = require('sequelize');

/**
 * Sequelize migration:
 * - Deletes api_scope '@admin.island.is/application-system' after handling FK references.
 * - Deletes referencing rows in:
 *   - api_scope_delegation_types
 *   - api_scope_user_access
 *   - api_scope_user_claim
 *   - personal_representative_scope_permission
 *   - delegation_scope
 *
 */

module.exports = {
  up: async (queryInterface) => {
    const SCOPE_NAME = '@admin.island.is/application-system'

    await queryInterface.sequelize.transaction(async (transaction) => {
      // Ensure the old scope exists; if not, no-op (idempotent)
      const oldScope = await queryInterface.sequelize.query(
        `SELECT name FROM api_scope WHERE name = :oldScope LIMIT 1`,
        {
          transaction,
          replacements: { oldScope: SCOPE_NAME },
          type: QueryTypes.SELECT,
        }
      );

      if (!oldScope || oldScope.length === 0) {
        return
      }

      // Delete dependent rows (NO ACTION FKs)
      await queryInterface.sequelize.query(
        `DELETE FROM api_scope_delegation_types WHERE api_scope_name = :oldScope`,
        { transaction, replacements: { oldScope: SCOPE_NAME } },
      )

      await queryInterface.sequelize.query(
        `DELETE FROM api_scope_user_access WHERE scope = :oldScope`,
        { transaction, replacements: { oldScope: SCOPE_NAME } },
      )

      await queryInterface.sequelize.query(
        `DELETE FROM api_scope_user_claim WHERE api_scope_name = :oldScope`,
        { transaction, replacements: { oldScope: SCOPE_NAME } },
      )

      await queryInterface.sequelize.query(
        `DELETE FROM personal_representative_scope_permission WHERE api_scope_name = :oldScope`,
        { transaction, replacements: { oldScope: SCOPE_NAME } },
      )

      await queryInterface.sequelize.query(
        `DELETE FROM delegation_scope WHERE scope_name = :oldScope`,
        { transaction, replacements: { oldScope: SCOPE_NAME } },
      )

      // Finally delete the api_scope row itself
      await queryInterface.sequelize.query(
        `DELETE FROM api_scope WHERE name = :oldScope`,
        { transaction, replacements: { oldScope: SCOPE_NAME } },
      )
    })
  },

  down: async () => {
    // Down migration left empty as it's impossible to know the full state of deleted data,
    // and restoring it could cause data integrity issues.
  },
}
