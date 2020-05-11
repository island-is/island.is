'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
      BEGIN;

        CREATE TABLE issuer (
          id UUID NOT NULL,
          ssn VARCHAR NOT NULL,
          created TIMESTAMP WITH TIME ZONE DEFAULT now(),
          modified TIMESTAMP WITH TIME ZONE,
          UNIQUE (ssn),
          PRIMARY KEY (id)
        );

        CREATE TABLE application (
          id UUID NOT NULL,
          created TIMESTAMP WITH TIME ZONE DEFAULT now(),
          modified TIMESTAMP WITH TIME ZONE,
          type VARCHAR NOT NULL,
          state VARCHAR NOT NULL,
          issuer_id UUID NOT NULL,
          data JSONB NOT NULL DEFAULT '{}',
          FOREIGN KEY (issuer_id) REFERENCES "issuer" (id) ON DELETE CASCADE,
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
  }
};
