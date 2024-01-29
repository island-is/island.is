'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
      BEGIN;
        UPDATE public.delegation_scope
          SET scope_name='@admin.island.is/application-system:admin'
          WHERE scope_name='@admin.island.is/application-system';

        UPDATE public.api_scope_user_access
          SET scope='@admin.island.is/application-system:admin'
          WHERE scope='@admin.island.is/application-system';

      COMMIT;
    `)
  },

  //down action will not be able to distinguish between delegations and accesses that were before and after the migration
  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
      BEGIN;
        UPDATE public.delegation_scope
          SET scope_name='@admin.island.is/application-system'
          WHERE scope_name='@admin.island.is/application-system:admin';

        UPDATE public.api_scope_user_access
          SET scope='@admin.island.is/application-system'
          WHERE scope='@admin.island.is/application-system:admin';
      COMMIT;
    `)
  },
}
