'use strict'
/* eslint-env node */

module.exports = {
  up: (queryInterface) => {
    return queryInterface.sequelize.query(`
      BEGIN;

        alter table admin_access drop constraint admin_access_pkey;
        alter table admin_access add primary key (national_id, scope);

      COMMIT;
    `)
  },

  down: (queryInterface) => {
    return queryInterface.sequelize.query(`
      BEGIN;

        alter table admin_access drop constraint admin_access_pkey;
        alter table admin_access add primary key (national_id);
        
      COMMIT;
    `)
  },
}
