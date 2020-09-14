'use strict'

module.exports = {
  up: (queryInterface) => {
    return queryInterface.sequelize.query(`
      BEGIN;

      CREATE TABLE identity_resource (
        id UUID NOT NULL,
        enabled BOOLEAN NOT NULL DEFAULT false,
        name VARCHAR NOT NULL,
        display_name VARCHAR NOT NULL,
        description VARCHAR,
        show_in_discovery_document BOOLEAN NOT NULL DEFAULT false,
        required BOOLEAN NOT NULL DEFAULT false,
        emphasize BOOLEAN NOT NULL DEFAULT false,
        created TIMESTAMP WITH TIME ZONE DEFAULT now(),
        modified TIMESTAMP WITH TIME ZONE,
        PRIMARY KEY (id)
      );

      CREATE TABLE identity_resource_user_claim (
        identity_resource_id UUID NOT NULL,
        claim_name VARCHAR NOT NULL,
        created TIMESTAMP WITH TIME ZONE DEFAULT now(),
        modified TIMESTAMP WITH TIME ZONE,
        PRIMARY KEY (identity_resource_id, claim_name),
        CONSTRAINT FK_identity_resource_user_claim_identity_resource FOREIGN KEY (identity_resource_id) REFERENCES identity_resource (id)
      );

      CREATE TABLE api_scope (
        id UUID NOT NULL,
        enabled BOOLEAN NOT NULL DEFAULT false,
        name VARCHAR NOT NULL,
        display_name VARCHAR NOT NULL,
        description VARCHAR,
        show_in_discovery_document BOOLEAN NOT NULL DEFAULT false,
        required BOOLEAN NOT NULL DEFAULT false,
        emphasize BOOLEAN NOT NULL DEFAULT false,
        created TIMESTAMP WITH TIME ZONE DEFAULT now(),
        modified TIMESTAMP WITH TIME ZONE,
        PRIMARY KEY (id)
      );

      CREATE TABLE api_scope_user_claim (
        api_scope_id UUID NOT NULL,
        claim_name VARCHAR NOT NULL,
        created TIMESTAMP WITH TIME ZONE DEFAULT now(),
        modified TIMESTAMP WITH TIME ZONE,
        PRIMARY KEY (api_scope_id, claim_name),
        CONSTRAINT FK_api_scope_user_claim_api_scope FOREIGN KEY (api_scope_id) REFERENCES api_scope (id)
      );

      CREATE TABLE api_resource (
        id UUID NOT NULL,
        enabled BOOLEAN NOT NULL DEFAULT false,
        name VARCHAR NOT NULL,
        display_name VARCHAR NOT NULL,
        description VARCHAR,
        show_in_discovery_document BOOLEAN NOT NULL DEFAULT false,
        created TIMESTAMP WITH TIME ZONE DEFAULT now(),
        modified TIMESTAMP WITH TIME ZONE,
        PRIMARY KEY (id)
      );

      CREATE TABLE api_resource_user_claim (
        api_resource_id UUID NOT NULL,
        claim_name VARCHAR NOT NULL,
        created TIMESTAMP WITH TIME ZONE DEFAULT now(),
        modified TIMESTAMP WITH TIME ZONE,
        PRIMARY KEY (api_resource_id, claim_name),
        CONSTRAINT FK_api_resource_user_claim_api_resource FOREIGN KEY (api_resource_id) REFERENCES api_resource (id)
      );

      CREATE TABLE api_resource_scope (
        api_resource_id UUID NOT NULL,
        scope_name VARCHAR NOT NULL,
        created TIMESTAMP WITH TIME ZONE DEFAULT now(),
        modified TIMESTAMP WITH TIME ZONE,
        PRIMARY KEY (api_resource_id, scope_name),
        CONSTRAINT FK_api_resource_scope_api_resource FOREIGN KEY (api_resource_id) REFERENCES api_resource (id)
      );

      CREATE TABLE api_resource_secret (
        api_resource_id UUID NOT NULL,
        value VARCHAR NOT NULL,
        description VARCHAR,
        expiration TIMESTAMP WITH TIME ZONE,
        type VARCHAR NOT NULL,
        created TIMESTAMP WITH TIME ZONE DEFAULT now(),
        modified TIMESTAMP WITH TIME ZONE,
        PRIMARY KEY (api_resource_id, value),
        CONSTRAINT FK_api_resource_secret_api_resource FOREIGN KEY (api_resource_id) REFERENCES api_resource (id)
      );

      COMMIT;
    `)
  },

  down: (queryInterface) => {
    return queryInterface.sequelize.query(`
      BEGIN;

      DROP TABLE identity_resource_user_claim;
      DROP TABLE identity_resource;

      DROP TABLE api_scope_user_claim;
      DROP TABLE api_scope;

      DROP TABLE api_resource_user_claim;
      DROP TABLE api_resource_scope;
      DROP TABLE api_resource_secret;
      DROP TABLE api_resource;

      COMMIT;
    `)
  },
}
