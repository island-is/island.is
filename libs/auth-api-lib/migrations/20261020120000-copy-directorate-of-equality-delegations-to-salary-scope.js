'use strict'

const { QueryTypes } = require('sequelize')

/**
 * The salary report got its own scope, '@island.is/applications/directorate-of-equality-salary',
 * split off the generic '@island.is/applications/directorate-of-equality' scope, which stays
 * with the equality report. Everyone who was granted the generic scope through a custom
 * delegation also gets the salary scope, keeping the same validity period.
 *
 * delegation_scope has a foreign key to api_scope and migrations run before seeds, so the
 * salary scope must already exist from an earlier release. On an empty database there is
 * nothing to copy and this is a no-op. If there are grants to copy but the salary scope is
 * missing, this throws so the migration is retried instead of being recorded as done.
 */
module.exports = {
  up: async (queryInterface) => {
    const OLD_SCOPE = '@island.is/applications/directorate-of-equality'
    const NEW_SCOPE = '@island.is/applications/directorate-of-equality-salary'

    await queryInterface.sequelize.transaction(async (transaction) => {
      const [{ count }] = await queryInterface.sequelize.query(
        `SELECT COUNT(*)::int AS count FROM delegation_scope WHERE scope_name = :oldScope`,
        {
          transaction,
          replacements: { oldScope: OLD_SCOPE },
          type: QueryTypes.SELECT,
        },
      )

      if (count === 0) {
        return
      }

      const newScope = await queryInterface.sequelize.query(
        `SELECT name FROM api_scope WHERE name = :newScope LIMIT 1`,
        {
          transaction,
          replacements: { newScope: NEW_SCOPE },
          type: QueryTypes.SELECT,
        },
      )

      if (newScope.length === 0) {
        throw new Error(
          `Scope ${NEW_SCOPE} does not exist, cannot copy ${count} delegation scopes from ${OLD_SCOPE}`,
        )
      }

      await queryInterface.sequelize.query(
        `
          INSERT INTO delegation_scope (id, delegation_id, scope_name, valid_from, valid_to, created, modified)
            SELECT uuid_generate_v4(), t.delegation_id, :newScope, t.valid_from, t.valid_to, NOW(), NOW()
            FROM delegation_scope t
            WHERE t.scope_name = :oldScope
            AND NOT EXISTS (
              SELECT 1 FROM delegation_scope t2
              WHERE t2.delegation_id = t.delegation_id
              AND t2.scope_name = :newScope
            )
        `,
        {
          transaction,
          replacements: { oldScope: OLD_SCOPE, newScope: NEW_SCOPE },
        },
      )
    })
  },

  down: () => {
    // It's impossible to know which salary scope delegations were granted by
    // users after the migration, thus it's impossible to revert it.
  },
}
