'use strict'
/* eslint-env node */

module.exports = {
  up: (queryInterface) => {
    return queryInterface.sequelize.query(`
      BEGIN;

        update api_scope set is_access_controlled = true
        where name in ('@island.is/auth/admin:root', '@island.is/auth/admin:full');

      COMMIT;
    `)
  },

  down: (queryInterface) => {
    return queryInterface.sequelize.query(`
      BEGIN;

        update api_scope set is_access_controlled = false
        where name in ('@island.is/auth/admin:root', '@island.is/auth/admin:full');
        
      COMMIT;
    `)
  },
}
