'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
      BEGIN;
        CREATE TABLE client (
          client_id VARCHAR NOT NULL,
          allow_offline_access VARCHAR NOT NULL,
          identity_token_lifetime         INTEGER NOT NULL DEFAULT 300,
          access_token_lifetime           INTEGER NOT NULL DEFAULT 3600,
          authorization_code_lifetime     INTEGER NOT NULL DEFAULT 300,
          absolute_refresh_token_lifetime INTEGER NOT NULL DEFAULT 2592000,
          sliding_refresh_token_lifetime  INTEGER NOT NULL DEFAULT 1296000,
          consent_lifetime                INTEGER,
          refresh_token_usage            INTEGER NOT NULL DEFAULT 1,
          update_AT_claims_on_refresh    VARCHAR NOT NULL DEFAULT 'Y',
          refresh_token_expiration       INTEGER NOT NULL DEFAULT 0,
          access_token_type             INTEGER NOT NULL DEFAULT 0,
          enable_local_login             VARCHAR NOT NULL DEFAULT 'Y',
          include_jwt_Id                 VARCHAR NOT NULL DEFAULT 'Y',
          always_send_client_claims      VARCHAR NOT NULL DEFAULT 'N',
          pair_wise_subject_salt         VARCHAR,
          user_sso_lifetime              INTEGER,
          user_code_type                 VARCHAR,
          device_code_lifetime           INTEGER NOT NULL DEFAULT 300,
          always_include_UC_in_id_token  VARCHAR NOT NULL DEFAULT 'N',
          back_channel_logout_session_rq VARCHAR NOT NULL DEFAULT 'Y',
          enabled                        VARCHAR NOT NULL DEFAULT 'Y',
          logo_uri                       VARCHAR,
          require_consent                VARCHAR DEFAULT 'N',
          require_pkce                  VARCHAR NOT NULL DEFAULT 'N',
          allow_plain_text_pkce           VARCHAR NOT NULL DEFAULT 'N',
          allow_access_token_via_browser   VARCHAR NOT NULL DEFAULT 'N',
          front_channel_logout_uri        VARCHAR,
          front_channel_logout_session_rq  VARCHAR NOT NULL DEFAULT 'Y',
          back_channel_logout_uri         VARCHAR,
          allow_remember_consent         VARCHAR NOT NULL DEFAULT 'Y',
          client_claims_prefix           VARCHAR NOT NULL,
          client_name                   VARCHAR,
          client_uri                    VARCHAR,
          description                  VARCHAR,
          protocol_type                 VARCHAR NOT NULL,
          require_client_secret          VARCHAR NOT NULL DEFAULT 'Y',
          enable_mobile_login            VARCHAR NOT NULL DEFAULT 'N',
          mobile_login_text              VARCHAR,
          created TIMESTAMP WITH TIME ZONE DEFAULT now(),
          modified TIMESTAMP WITH TIME ZONE,
          PRIMARY KEY (client_id)
      );

      CREATE TABLE client_allowed_cors_origin (
        origin VARCHAR NOT NULL,
        client_id VARCHAR NOT NULL,
        created TIMESTAMP WITH TIME ZONE DEFAULT now(),
        modified TIMESTAMP WITH TIME ZONE,
        CONSTRAINT FK_client_allowed_cors_origin_client FOREIGN KEY (client_Id) REFERENCES client (client_id)
      );

      CREATE TABLE client_allowed_scope (
        scope_name VARCHAR NOT NULL,
        client_id  VARCHAR NOT NULL,
        created TIMESTAMP WITH TIME ZONE DEFAULT now(),
        modified TIMESTAMP WITH TIME ZONE,
        CONSTRAINT FK_client_allowed_scope_client FOREIGN KEY (client_id) REFERENCES client (client_id)
      );

      CREATE TABLE client_idp_restrictions (
        id uuid NOT NULL,
        name VARCHAR NOT NULL,
        client_id VARCHAR NOT NULL,
        created TIMESTAMP WITH TIME ZONE DEFAULT now(),
        modified TIMESTAMP WITH TIME ZONE,
        CONSTRAINT PK_client_identity_provider_restrictions PRIMARY KEY (id),
        CONSTRAINT FK_client_identity_provider_restrictions_client FOREIGN KEY (client_id) REFERENCES client (client_id)
      );

      CREATE TABLE client_post_logout_redirect_uri (
        client_id    VARCHAR NOT NULL,
        redirect_uri VARCHAR NOT NULL,
        created TIMESTAMP WITH TIME ZONE DEFAULT now(),
        modified TIMESTAMP WITH TIME ZONE,
        CONSTRAINT FK_client_post_redirect_uri_client FOREIGN KEY (client_id) REFERENCES client (client_id)
      );

      CREATE TABLE client_secret (
        client_id VARCHAR NOT NULL,
        value VARCHAR NOT NULL,
        description VARCHAR NULL,
        type VARCHAR NOT NULL,
        expiration TIMESTAMP WITH TIME ZONE NULL,
        created TIMESTAMP WITH TIME ZONE DEFAULT now(),
        modified TIMESTAMP WITH TIME ZONE,
        CONSTRAINT FK_client_secret_client FOREIGN KEY (client_id) REFERENCES client (client_id)
      );
    COMMIT;
    `)
  },
  down: (queryInterface) => {
    return queryInterface.sequelize.query(`
      BEGIN;
        DROP TABLE client_secret;
        DROP TABLE client_post_logout_redirect_uri;
        DROP TABLE client_idp_restrictions;
        DROP TABLE client_allowed_cors_origin;
        DROP TABLE client_allowed_scope;
        DROP TABLE client;
      COMMIT;
    `)
  },
};
