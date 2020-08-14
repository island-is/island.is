'use strict'

module.exports = {
  up: (queryInterface) => {
    return queryInterface.sequelize.query(`
      BEGIN;

        CREATE TABLE user_identity (
          id UUID NOT NULL,
          subject_id VARCHAR NOT NULL,
          name VARCHAR NOT NULL,
          provider_name VARCHAR NOT NULL,
          provider_subject_id VARCHAR NOT NULL,
          created TIMESTAMP WITH TIME ZONE DEFAULT now(),
          modified TIMESTAMP WITH TIME ZONE,
          UNIQUE (subject_id),
          PRIMARY KEY (id)
        );

      COMMIT;
    `)
  },

  down: (queryInterface) => {
    return queryInterface.sequelize.query(`
      DROP TABLE user_identities;
    `)
  },
}
