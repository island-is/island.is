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
        PRIMARY KEY (identity_resource_id, claim_name)
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
        PRIMARY KEY (api_scope_id, claim_name)
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
        PRIMARY KEY (api_resource_id, claim_name)
      );

      CREATE TABLE api_resource_scope (
        api_resource_id UUID NOT NULL,
        scope_name VARCHAR NOT NULL,
        created TIMESTAMP WITH TIME ZONE DEFAULT now(),
        modified TIMESTAMP WITH TIME ZONE,
        PRIMARY KEY (api_resource_id, scope_name)
      );

      COMMIT;
    `)
  },

  down: (queryInterface) => {
    return queryInterface.sequelize.query(`
      BEGIN;

      DROP TABLE identity_resource_user_claim;
      DROP TABLE identity_resource;

      COMMIT;
    `)
  },
}
