'use strict'
/* eslint-env node */

module.exports = {
  up: (queryInterface) => {
    return queryInterface.sequelize.query(`
      BEGIN;

        CREATE TABLE admin_access (
          national_id VARCHAR NOT NULL,
          scope VARCHAR NOT NULL,
          email VARCHAR NOT NULL,
          active BOOLEAN NOT NULL DEFAULT true,
          created TIMESTAMP WITH TIME ZONE DEFAULT now(),
          modified TIMESTAMP WITH TIME ZONE,
          PRIMARY KEY (national_id)
        );

      COMMIT;
    `)
  },

  down: (queryInterface) => {
    return queryInterface.sequelize.query(`
      DROP TABLE admin_access;
    `)
  },
}
