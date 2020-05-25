'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
      BEGIN;

        CREATE TABLE issuer (
          ssn VARCHAR NOT NULL,
          created TIMESTAMP WITH TIME ZONE DEFAULT now(),
          modified TIMESTAMP WITH TIME ZONE,
          PRIMARY KEY (ssn)
        );

        CREATE TABLE application (
          id UUID NOT NULL,
          created TIMESTAMP WITH TIME ZONE DEFAULT now(),
          modified TIMESTAMP WITH TIME ZONE,
          type VARCHAR NOT NULL,
          state VARCHAR NOT NULL,
          issuer_ssn VARCHAR NOT NULL,
          data JSONB NOT NULL DEFAULT '{}',
          UNIQUE (issuer_ssn, type),
          FOREIGN KEY (issuer_ssn) REFERENCES "issuer" (ssn) ON DELETE CASCADE,
          PRIMARY KEY (id)
        );

      COMMIT;
    `)
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
      BEGIN;

        DROP TABLE application;
        DROP TABLE issuer;

      COMMIT;
    `)
  },
}
