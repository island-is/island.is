'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
      BEGIN;
        DROP TABLE admin_access;
      COMMIT;
    `)
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
    BEGIN;
      CREATE TABLE admin_access (
        national_id VARCHAR NOT NULL,
        scope VARCHAR NOT NULL,
        email VARCHAR NOT NULL,
        active BOOLEAN NOT NULL DEFAULT true,
        created TIMESTAMP WITH TIME ZONE DEFAULT now(),
        modified TIMESTAMP WITH TIME ZONE,
        PRIMARY KEY (national_id, scope)
      );
    COMMIT;
  `)
  },
}
