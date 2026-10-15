'use strict'

/**
 * The salary report gets its own scope, split off the generic
 * '@island.is/applications/directorate-of-equality' scope, which stays with the
 * equality report. Everyone who was granted the generic scope through a custom
 * delegation also gets the salary scope, so nobody loses access to the salary
 * report. Procuring holders are granted both scopes through the scope config.
 */
module.exports = {
  up: (queryInterface) => {
    return queryInterface.sequelize.query(`
      BEGIN;
        INSERT INTO public.delegation_scope (id, delegation_id, scope_name, valid_from, valid_to, created, modified)
          SELECT uuid_generate_v4(), t.delegation_id, '@island.is/applications/directorate-of-equality-salary', t.valid_from, t.valid_to, NOW(), NOW()
          FROM public.delegation_scope t
          WHERE t.scope_name = '@island.is/applications/directorate-of-equality'
          AND NOT EXISTS (
            SELECT 1 FROM public.delegation_scope t2
            WHERE t2.delegation_id = t.delegation_id
            AND t2.scope_name = '@island.is/applications/directorate-of-equality-salary'
          );
      COMMIT;
    `)
  },

  down: () => {
    // It's impossible to know which salary scope delegations were granted by
    // users after the migration, thus it's impossible to revert it.
  },
}
