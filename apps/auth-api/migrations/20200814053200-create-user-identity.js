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

        CREATE TABLE claim (
          id UUID NOT NULL,
          user_identity_id UUID NOT NULL,
          type VARCHAR NOT NULL,
          value VARCHAR NOT NULL,
          value_type VARCHAR NOT NULL,
          issuer VARCHAR NOT NULL,
          original_issuer VARCHAR NOT NULL,
          created TIMESTAMP WITH TIME ZONE DEFAULT now(),
          modified TIMESTAMP WITH TIME ZONE,
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
