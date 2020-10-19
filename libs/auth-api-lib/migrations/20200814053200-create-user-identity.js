'use strict'
/* eslint-env node */

module.exports = {
  up: (queryInterface) => {
    return queryInterface.sequelize.query(`
      BEGIN;

        CREATE TABLE user_identity (
          id UUID NOT NULL,
          subject_id VARCHAR (100) NOT NULL,
          name VARCHAR (150) NOT NULL,
          provider_name VARCHAR (100) NOT NULL,
          provider_subject_id VARCHAR (150) NOT NULL,
          profile_id UUID,
          active BOOLEAN NOT NULL DEFAULT true,
          created TIMESTAMP WITH TIME ZONE DEFAULT now(),
          modified TIMESTAMP WITH TIME ZONE,
          UNIQUE (subject_id),
          PRIMARY KEY (id)
        );

        CREATE TABLE claim (
          id UUID NOT NULL,
          user_identity_id UUID NOT NULL,
          type VARCHAR (100) NOT NULL,
          value VARCHAR (150) NOT NULL,
          value_type VARCHAR (100) NOT NULL,
          issuer VARCHAR (200) NOT NULL,
          original_issuer VARCHAR (200) NOT NULL,
          created TIMESTAMP WITH TIME ZONE DEFAULT now(),
          modified TIMESTAMP WITH TIME ZONE,
          PRIMARY KEY (id)
        );

      COMMIT;
    `)
  },

  down: (queryInterface) => {
    return queryInterface.sequelize.query(`
      DROP TABLE user_identity;
      DROP TABLE claim;
    `)
  },
}
