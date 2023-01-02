'use strict'

module.exports = {
  up: (queryInterface) => {
    return queryInterface.sequelize.query(`
      BEGIN;

        CREATE TABLE resource (
          id UUID NOT NULL,
          national_id VARCHAR NOT NULL,
          created TIMESTAMP WITH TIME ZONE DEFAULT now(),
          modified TIMESTAMP WITH TIME ZONE,
          UNIQUE (national_id),
          PRIMARY KEY (id)
        );

      COMMIT;
    `)
  },

  down: (queryInterface) => {
    return queryInterface.sequelize.query(`
      DROP TABLE resource;
    `)
  },
}
