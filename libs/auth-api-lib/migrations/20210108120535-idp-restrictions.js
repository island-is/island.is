'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
      BEGIN;
        CREATE TABLE idp_restrictions (
          name VARCHAR NOT NULL,
          description VARCHAR NOT NULL,
          helptext VARCHAR NOT NULL,
          level INTEGER NOT NULL,
          created TIMESTAMP WITH TIME ZONE DEFAULT now(),
          modified TIMESTAMP WITH TIME ZONE,
          PRIMARY KEY (name)
        );
      COMMIT;
    `)
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
      DROP TABLE idp_restrictions;
    `)
  },
}
