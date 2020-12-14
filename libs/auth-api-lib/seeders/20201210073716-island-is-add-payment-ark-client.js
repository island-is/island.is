'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    const clients = [
      {
        client_id: 'island-ark-1',
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
        client_claims_prefix: 'client_ark_',
        protocol_type: 'oidc',
        consent_lifetime: 3600,
      },
    ]

    const scopes = [
      {
        client_id: 'island-ark-1',
        scope_name: 'openid',
      },
      {
        client_id: 'island-ark-1',
        scope_name: 'profile',
      },
      {
        client_id: 'island-ark-1',
        scope_name: 'offline_access',
      },
      {
        client_id: 'island-ark-1',
        scope_name: 'api_resource.scope',
      },
    ]

    const redirectUrls = [
      {
        client_id: 'island-ark-1',
        redirect_uri: 'https://birtingur-uat.edoc.is/internal/v3/oidc',
      },
      {
        client_id: 'island-ark-1',
        redirect_uri: 'https://www.arkid.is/internal/v3/oidc',
      },
    ]

    const clientGrantTypes = [
      {
        client_id: 'island-ark-1',
        grant_type: 'authorization_code',
      },
    ]

    const resourceClaims = [
      {
        api_resource_name: 'api_resource',
        claim_name: 'name',
      },
    ]

    return new Promise((resolve) => {
      Promise.all([
        queryInterface.sequelize.query(
          "UPDATE client_redirect_uri SET redirect_uri = 'https://tcqqxwk4o7udq5x-hgrdevatp.adb.eu-frankfurt-1.oraclecloudapps.com/ords/apex_authentication_callback' WHERE client_id IN ('apex-auth_client') AND redirect_uri IN ('https://tcqqxwk4o7udq5x-hgrdevatp.adb.eu-frankfurt-1.oraclecloudapps.com/ords/r/hms_app_app/test-island-is-authentication/signin-oidc')",
        ),
        queryInterface.bulkInsert('client', clients, {}),
      ]).then(() => {
        Promise.all([
          queryInterface.bulkInsert('client_allowed_scope', scopes, {}),
          queryInterface.bulkInsert('client_redirect_uri', redirectUrls, {}),
          queryInterface.bulkInsert('client_grant_type', clientGrantTypes, {}),
          queryInterface.bulkInsert(
            'api_resource_user_claim',
            resourceClaims,
            {},
          ),
        ]).then(() => resolve('done'))
      })
    })
  },

  down: (queryInterface, Sequelize) => {
    const clients = queryInterface.bulkDelete('client', [
      {
        client_id: 'island-ark-1',
        client_claims_prefix: 'client_ark_',
      },
    ])

    const scopes = queryInterface.bulkDelete('client_allowed_scope', [
      {
        client_id: 'island-ark-1',
        scope_name: 'openid',
      },
      {
        client_id: 'island-ark-1',
        scope_name: 'profile',
      },
      {
        client_id: 'island-ark-1',
        scope_name: 'offline_access',
      },
      {
        client_id: 'island-ark-1',
        scope_name: 'api_resource.scope',
      },
    ])

    const redirectUrls = queryInterface.bulkDelete('client_redirect_uri', [
      {
        client_id: 'island-ark-1',
        redirect_uri: 'https://birtingur-uat.edoc.is/internal/v3/oidc',
      },
      {
        client_id: 'island-ark-1',
        redirect_uri: 'https://www.arkid.is/internal/v3/oidc',
      },
    ])

    const clientGrantTypes = queryInterface.bulkDelete('client_grant_type', [
      {
        client_id: 'island-ark-1',
        grant_type: 'authorization_code',
      },
    ])

    return new Promise((resolve) => {
      Promise.all([scopes, redirectUrls, clientGrantTypes]).then(() => {
        Promise.all([
          clients,
          queryInterface.sequelize.query(
            "UPDATE client_redirect_uri SET redirect_uri = 'https://tcqqxwk4o7udq5x-hgrdevatp.adb.eu-frankfurt-1.oraclecloudapps.com/ords/r/hms_app_app/test-island-is-authentication/signin-oidc' WHERE client_id IN ('apex-auth_client') AND redirect_uri IN ('https://tcqqxwk4o7udq5x-hgrdevatp.adb.eu-frankfurt-1.oraclecloudapps.com/ords/apex_authentication_callback')",
          ),
        ]).then(() => {
          resolve('done')
        })
      })
    })
  },
}
