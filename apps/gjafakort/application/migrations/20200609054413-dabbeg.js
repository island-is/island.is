'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
      BEGIN;

        CREATE TABLE audit_log (
          id UUID NOT NULL,
          created TIMESTAMP WITH TIME ZONE DEFAULT now(),
          modified TIMESTAMP WITH TIME ZONE,
          state VARCHAR NOT NULL,
          title VARCHAR NOT NULL,
          data JSONB NOT NULL DEFAULT '{}',
          author_ssn VARCHAR NOT NULL,
          application_id UUID NOT NULL,
          FOREIGN KEY (application_id) REFERENCES "application" (id) ON DELETE CASCADE,
          PRIMARY KEY (id)
        );

      COMMIT;
    `)
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
      BEGIN;

        DROP TABLE audit_log;

      COMMIT;
    `)
  },
}
