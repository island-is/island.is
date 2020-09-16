'use strict';
/* eslint-env node */
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable no-undef */

// eslint-disable-next-line @typescript-eslint/no-var-requires
const SHA256 = require("crypto-js/sha256");

module.exports = {
  up: (queryInterface) => {
    const clients = [
      {
        client_id: 'dummy',
        require_client_secret: false,
        require_pkce: false,

        //defaults
        allow_offline_access: false,
        identity_token_lifetime: 300,
        access_token_lifetime: 3600,
        authorization_code_lifetime: 300,
        absolute_refresh_token_lifetime: 2592000,
        sliding_refresh_token_lifetime: 1296000,
        refresh_token_usage: 1,
        update_access_token_claims_on_refresh: true,
        refresh_token_expiration: 0,
        access_token_type: 0,
        enable_local_login: true,
        include_jwt_id: true,
        always_send_client_claims: false,
        device_code_lifetime: 300,
        always_include_user_claims_in_id_token: false,
        back_channel_logout_session_required: true,
        enabled: true,
        require_consent: false,
        allow_plain_text_pkce: false,
        allow_access_token_via_browser: true,
        front_channel_logout_session_required: true,
        allow_remember_consent: true,
        client_claims_prefix: 'client_',
        protocol_type: 'oidc',
        consent_lifetime: 3600
      },
      {
        client_id: 'postman',
        require_client_secret: false,
        require_pkce: false,

        //defaults
        allow_offline_access: false,
        identity_token_lifetime: 300,
        access_token_lifetime: 3600,
        authorization_code_lifetime: 300,
        absolute_refresh_token_lifetime: 2592000,
        sliding_refresh_token_lifetime: 1296000,
        refresh_token_usage: 1,
        update_access_token_claims_on_refresh: true,
        refresh_token_expiration: 0,
        access_token_type: 0,
        enable_local_login: true,
        include_jwt_id: true,
        always_send_client_claims: false,
        device_code_lifetime: 300,
        always_include_user_claims_in_id_token: false,
        back_channel_logout_session_required: true,
        enabled: true,
        require_consent: false,
        allow_plain_text_pkce: false,
        allow_access_token_via_browser: true,
        front_channel_logout_session_required: true,
        allow_remember_consent: true,
        client_claims_prefix: 'client_',
        protocol_type: 'oidc',
        consent_lifetime: 3600
      },
      {
        client_id: 'island-is-1',
        require_client_secret: false,
        enable_local_login: true,
        require_pkce: true,
        allow_offline_access: true,


        //defaults
        identity_token_lifetime: 300,
        access_token_lifetime: 3600,
        authorization_code_lifetime: 300,
        absolute_refresh_token_lifetime: 2592000,
        sliding_refresh_token_lifetime: 1296000,
        refresh_token_usage: 1,
        update_access_token_claims_on_refresh: true,
        refresh_token_expiration: 0,
        access_token_type: 0,
        include_jwt_id: true,
        always_send_client_claims: false,
        device_code_lifetime: 300,
        always_include_user_claims_in_id_token: false,
        back_channel_logout_session_required: true,
        enabled: true,
        require_consent: false,
        allow_plain_text_pkce: false,
        allow_access_token_via_browser: true,
        front_channel_logout_session_required: true,
        allow_remember_consent: true,
        client_claims_prefix: 'client_',
        protocol_type: 'oidc',
        consent_lifetime: 3600
      },
      {
        client_id: 'island-is-client-cred-1',
        require_client_secret: false,
        enable_local_login: true,
        require_pkce: true,
        allow_offline_access: true,

        //defaults
        identity_token_lifetime: 300,
        access_token_lifetime: 3600,
        authorization_code_lifetime: 300,
        absolute_refresh_token_lifetime: 2592000,
        sliding_refresh_token_lifetime: 1296000,
        refresh_token_usage: 1,
        update_access_token_claims_on_refresh: true,
        refresh_token_expiration: 0,
        access_token_type: 0,
        include_jwt_id: true,
        always_send_client_claims: false,
        device_code_lifetime: 300,
        always_include_user_claims_in_id_token: false,
        back_channel_logout_session_required: true,
        enabled: true,
        require_consent: false,
        allow_plain_text_pkce: false,
        allow_access_token_via_browser: true,
        front_channel_logout_session_required: true,
        allow_remember_consent: true,
        client_claims_prefix: 'client_',
        protocol_type: 'oidc'
      }
    ];

    const scopes = [
      {
        client_id: 'postman',
        scope_name: 'openid'
      },
      {
        client_id: 'postman',
        scope_name: 'profile'
      },
      {
        client_id: 'postman',
        scope_name: 'email'
      },
      {
        client_id: 'postman',
        scope_name: 'saml'
      },
      {
        client_id: 'postman',
        scope_name: 'postman_resource.scope'
      },
      {
        client_id: 'island-is-1',
        scope_name: 'openid'
      },
      {
        client_id: 'island-is-1',
        scope_name: 'profile'
      },
      {
        client_id: 'island-is-1',
        scope_name: 'offline_access'
      },
      {
        client_id: 'island-is-client-cred-1',
        scope_name: 'api'
      }
    ];

    const cors = [ {
      client_id: 'dummy',
      origin: 'http://127.0.0.1'
    }];

    const clientIdbRestrictions = [
      {
        name: "islykill",
        client_id: "dummy",
      },
      {
        name: "dockobit",
        client_id: "dummy",
      }
    ];

    const redirectUri = [
      {
        client_id: 'postman',
        redirect_uri: 'https://postman'
      },
      {
        client_id: 'postman',
        redirect_uri: 'https://oauth.pstmn.io/v1/callback'
      },
      {
        client_id: 'island-is-1',
        redirect_uri: 'http://localhost:4200/signin-oidc'
      },
      {
        client_id: 'island-is-1',
        redirect_uri: 'https://localhost:4200/signin-oidc'
      }
    ];

    const secrets = [{
      client_id: 'island-is-client-cred-1',
      value: SHA256('secret').toString(),
      description: "secret for island-is-client-cred-1",
      expiration: new Date(),
      type: "General"
    }
    ];

    const postRedirects = [{
      client_id: 'dummy',
      redirect_uri: 'localhost:8080'
    }];

    const clientGrantTypes = [
    {
      client_id: 'postman',
      grant_type: 'authorization_code',
    },
    {
      client_id: 'island-is-1',
      grant_type: 'authorization_code',
    },
    {
      client_id: 'island-is-client-cred-1',
      grant_type: 'client_credentials'
    }
  ];


    return new Promise((resolve) => {
      queryInterface.bulkInsert('client', clients, {}).then(() => {
        Promise.all([
          queryInterface.bulkInsert('client_allowed_scope', scopes, {}),
          queryInterface.bulkInsert('client_allowed_cors_origin', cors, {}),
          queryInterface.bulkInsert('client_idp_restrictions', clientIdbRestrictions, {}),
          queryInterface.bulkInsert('client_redirect_uri', redirectUri, {}),
          queryInterface.bulkInsert('client_secret', secrets, {}),
          queryInterface.bulkInsert('client_post_logout_redirect_uri', postRedirects, {}),
          queryInterface.bulkInsert('client_grant_type', clientGrantTypes, {})
        ]).then(() => {
          resolve("done");
        })
      })
    })
  },

  down: (queryInterface) => {
    const redirectUris = queryInterface.bulkDelete('client_redirect_uri', null, {})
    const idpRestrictions = queryInterface.bulkDelete('client_idp_restrictions', null, {})
    const cors = queryInterface.bulkDelete('client_allowed_cors_origin', null, {})
    const scopes = queryInterface.bulkDelete('client_allowed_scope', null, {})
    const secrets = queryInterface.bulkDelete('client_secret', null, {})
    const postLogoutUris = queryInterface.bulkDelete('client_post_logout_redirect_uri', null, {})
    const clients = queryInterface.bulkDelete('client', null, {})
    const grantTypes = queryInterface.bulkDelete('client_grant_type', null, {})

    return new Promise((resolve) => {
      Promise.all([cors, scopes, idpRestrictions, redirectUris, secrets, postLogoutUris, grantTypes]).then(() => {
        clients.then(() => {
          resolve("done");
        })
      })
    })
  },
};
