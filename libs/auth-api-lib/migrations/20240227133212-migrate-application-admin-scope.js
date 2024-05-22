'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
      BEGIN;
        UPDATE public.delegation_scope t
          SET scope_name='@admin.island.is/application-system:admin'
          WHERE t.scope_name='@admin.island.is/application-system';

        UPDATE public.api_scope_user_access t
          SET scope='@admin.island.is/application-system:admin'
          WHERE scope='@admin.island.is/application-system'
          AND NOT EXISTS (
            SELECT 1 FROM public.api_scope_user_access t2
            WHERE t2.scope = '@admin.island.is/application-system:admin' and t2.national_id = t.national_id
          );

      COMMIT;
    `)
  },

  down: () => {
    // it's impossible to know which delegations were granted by users before or after the migration
    // thus it's impossible to revert the migration
  },
}
