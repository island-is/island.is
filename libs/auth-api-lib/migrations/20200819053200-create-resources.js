'use strict'
/* eslint-env node */

module.exports = {
  up: (queryInterface) => {
    return queryInterface.sequelize.query(`
      BEGIN;

      CREATE TABLE domain (
        name VARCHAR (150) NOT NULL,
        created TIMESTAMP WITH TIME ZONE DEFAULT now(),
        modified TIMESTAMP WITH TIME ZONE,
        PRIMARY KEY (name)
      );

      CREATE TABLE identity_resource (
        enabled BOOLEAN NOT NULL DEFAULT true,
        name VARCHAR (100) NOT NULL,
        display_name VARCHAR (100) NOT NULL,
        description VARCHAR,
        show_in_discovery_document BOOLEAN NOT NULL DEFAULT true,
        required BOOLEAN NOT NULL DEFAULT false,
        emphasize BOOLEAN NOT NULL DEFAULT false,
        created TIMESTAMP WITH TIME ZONE DEFAULT now(),
        modified TIMESTAMP WITH TIME ZONE,
        PRIMARY KEY (name)
      );

      CREATE TABLE identity_resource_user_claim (
        identity_resource_name VARCHAR (100) NOT NULL,
        claim_name VARCHAR (100) NOT NULL,
        created TIMESTAMP WITH TIME ZONE DEFAULT now(),
        modified TIMESTAMP WITH TIME ZONE,
        PRIMARY KEY (identity_resource_name, claim_name),
        CONSTRAINT FK_identity_resource_user_claim_identity_resource FOREIGN KEY (identity_resource_name) REFERENCES identity_resource (name)
      );

      CREATE TABLE api_scope (
        domain VARCHAR (100) NOT NULL,
        enabled BOOLEAN NOT NULL DEFAULT true,
        name VARCHAR (100) NOT NULL,
        display_name VARCHAR (100) NOT NULL,
        description VARCHAR,
        show_in_discovery_document BOOLEAN NOT NULL DEFAULT true,
        required BOOLEAN NOT NULL DEFAULT false,
        emphasize BOOLEAN NOT NULL DEFAULT false,
        created TIMESTAMP WITH TIME ZONE DEFAULT now(),
        modified TIMESTAMP WITH TIME ZONE,
        PRIMARY KEY (domain, name),
        CONSTRAINT FK_api_scope_domain FOREIGN KEY (domain) REFERENCES domain (name)
      );

      CREATE TABLE api_scope_user_claim (
        domain VARCHAR (150) NOT NULL,
        api_scope_name VARCHAR (100) NOT NULL,
        claim_name VARCHAR (100) NOT NULL,
        created TIMESTAMP WITH TIME ZONE DEFAULT now(),
        modified TIMESTAMP WITH TIME ZONE,
        PRIMARY KEY (domain, api_scope_name, claim_name),
        CONSTRAINT FK_api_scope_user_claim_api_scope FOREIGN KEY (domain, api_scope_name) REFERENCES api_scope (domain, name),
        CONSTRAINT FK_api_scope_domain FOREIGN KEY (domain) REFERENCES domain (name)
      );

      CREATE TABLE api_resource (
        domain VARCHAR (150) NOT NULL,
        enabled BOOLEAN NOT NULL DEFAULT true,
        name VARCHAR (100) NOT NULL,
        display_name VARCHAR (100) NOT NULL,
        description VARCHAR,
        show_in_discovery_document BOOLEAN NOT NULL DEFAULT true,
        created TIMESTAMP WITH TIME ZONE DEFAULT now(),
        modified TIMESTAMP WITH TIME ZONE,
        PRIMARY KEY (domain, name),
        CONSTRAINT FK_api_scope_domain FOREIGN KEY (domain) REFERENCES domain (name)
      );

      CREATE TABLE api_resource_user_claim (
        domain VARCHAR (150) NOT NULL,
        api_resource_name VARCHAR (100) NOT NULL,
        claim_name VARCHAR (100) NOT NULL,
        created TIMESTAMP WITH TIME ZONE DEFAULT now(),
        modified TIMESTAMP WITH TIME ZONE,
        PRIMARY KEY (domain, api_resource_name, claim_name),
        CONSTRAINT FK_api_resource_user_claim_api_resource FOREIGN KEY (domain, api_resource_name) REFERENCES api_resource (domain, name),
        CONSTRAINT FK_api_scope_domain FOREIGN KEY (domain) REFERENCES domain (name)
      );

      CREATE TABLE api_resource_scope (
        domain VARCHAR (150) NOT NULL,
        api_resource_name VARCHAR (100) NOT NULL,
        scope_name VARCHAR (100) NOT NULL,
        created TIMESTAMP WITH TIME ZONE DEFAULT now(),
        modified TIMESTAMP WITH TIME ZONE,
        PRIMARY KEY (domain, api_resource_name, scope_name),
        CONSTRAINT FK_api_resource_scope_api_resource FOREIGN KEY (domain, api_resource_name) REFERENCES api_resource (domain, name),
        CONSTRAINT FK_api_scope_domain FOREIGN KEY (domain) REFERENCES domain (name)
      );

      CREATE TABLE api_resource_secret (
        domain VARCHAR (150) NOT NULL,
        api_resource_name VARCHAR (100) NOT NULL,
        value VARCHAR (100) NOT NULL,
        description VARCHAR,
        expiration TIMESTAMP WITH TIME ZONE,
        type VARCHAR (100) NOT NULL,
        created TIMESTAMP WITH TIME ZONE DEFAULT now(),
        modified TIMESTAMP WITH TIME ZONE,
        PRIMARY KEY (domain, api_resource_name, value),
        CONSTRAINT FK_api_resource_secret_api_resource FOREIGN KEY (domain, api_resource_name) REFERENCES api_resource (domain, name),
        CONSTRAINT FK_api_scope_domain FOREIGN KEY (domain) REFERENCES domain (name)
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

      DROP TABLE domain;
      
      COMMIT;
    `)
  },
}
