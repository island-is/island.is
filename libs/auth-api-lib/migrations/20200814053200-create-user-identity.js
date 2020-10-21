'use strict'
/* eslint-env node */

module.exports = {
  up: (queryInterface) => {
    return queryInterface.sequelize.query(`
      BEGIN;

        CREATE TABLE user_identity (
          subject_id VARCHAR NOT NULL,
          name VARCHAR NOT NULL,
          provider_name VARCHAR NOT NULL,
          provider_subject_id VARCHAR NOT NULL,
          profile_id UUID,
          active BOOLEAN NOT NULL DEFAULT true,
          created TIMESTAMP WITH TIME ZONE DEFAULT now(),
          modified TIMESTAMP WITH TIME ZONE,
          PRIMARY KEY (subject_id)
        );

        CREATE TABLE claim (
          subject_id VARCHAR NOT NULL,
          type VARCHAR NOT NULL,
          value VARCHAR NOT NULL,
          value_type VARCHAR NOT NULL,
          issuer VARCHAR NOT NULL,
          original_issuer VARCHAR NOT NULL,
          created TIMESTAMP WITH TIME ZONE DEFAULT now(),
          modified TIMESTAMP WITH TIME ZONE,
          CONSTRAINT FK_claim_user_identity FOREIGN KEY (subject_id) REFERENCES user_identity (subject_id),
          PRIMARY KEY (subject_id, type)
        );

      COMMIT;
    `)
  },

  down: (queryInterface) => {
    return queryInterface.sequelize.query(`
      DROP TABLE claim;
      DROP TABLE user_identity;
    `)
  },
}
