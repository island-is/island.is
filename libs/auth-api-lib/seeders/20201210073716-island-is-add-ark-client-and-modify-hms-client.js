'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    const clients = [
      {
        client_id: 'island-ark-1',
        require_client_secret: false,
        enable_local_login: true,
        require_pkce: true,
        allow_offline_access: false,

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
        always_include_user_claims_in_id_token: true,
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

    return new Promise((resolve) => {
      Promise.all([
        queryInterface.sequelize.query(
          "UPDATE client_redirect_uri SET redirect_uri = 'https://tcqqxwk4o7udq5x-hgrdevatp.adb.eu-frankfurt-1.oraclecloudapps.com/ords/apex_authentication_callback' WHERE client_id IN ('apex-auth_client') AND redirect_uri IN ('https://tcqqxwk4o7udq5x-hgrdevatp.adb.eu-frankfurt-1.oraclecloudapps.com/ords/r/hms_app_app/test-island-is-authentication/signin-oidc')",
        ),
        queryInterface.bulkInsert('client', clients, {}),
        queryInterface.bulkDelete('client_allowed_scope', [
          {
            scope_name: 'apex-auth_api.scope',
            client_id: 'apex-auth_client',
          },
        ]),
        queryInterface.bulkDelete('api_resource_user_claim', [
          {
            api_resource_name: 'apex-auth_api',
            claim_name: 'nationalId',
          },
        ]),
        queryInterface.bulkDelete('api_resource_user_claim', [
          {
            api_resource_name: 'apex-auth_api',
            claim_name: 'name',
          },
        ]),
        queryInterface.bulkDelete('api_resource_scope', [
          {
            api_resource_name: 'apex-auth_api',
            scope_name: 'apex-auth_api.scope',
          },
        ]),
        queryInterface.bulkDelete('client_allowed_scope', [
          {
            client_id: 'apex-auth_client',
            scope_name: 'offline_access',
          },
        ]),
        queryInterface.sequelize.query(
          "UPDATE client SET always_include_user_claims_in_id_token = true, allow_offline_access = false WHERE client_id IN ('apex-auth_client')",
        ),
      ]).then(() => {
        Promise.all([
          queryInterface.bulkInsert('client_allowed_scope', scopes, {}),
          queryInterface.bulkInsert('client_redirect_uri', redirectUrls, {}),
          queryInterface.bulkInsert('client_grant_type', clientGrantTypes, {}),
          queryInterface.bulkDelete('api_resource', [
            {
              enabled: true,
              name: 'apex-auth_api',
              display_name: 'Resource for HMS apex',
              description: null,
              show_in_discovery_document: true,
            },
          ]),
          queryInterface.bulkDelete('api_scope', [
            {
              enabled: true,
              name: 'apex-auth_api.scope',
              display_name: 'Scope for HMS apex',
              description: null,
              show_in_discovery_document: true,
              required: false,
              emphasize: false,
            },
          ]),
        ]).then(() => resolve('done'))
      })
    })
  },

  down: (queryInterface, Sequelize) => {
    const client_allowed_scope = [
      {
        scope_name: 'apex-auth_api.scope',
        client_id: 'apex-auth_client',
      },
    ]
    const apiResourceUserClaim = [
      {
        api_resource_name: 'apex-auth_api',
        claim_name: 'nationalId',
      },
      {
        api_resource_name: 'apex-auth_api',
        claim_name: 'name',
      },
    ]

    const apiResourceScope = [
      {
        api_resource_name: 'apex-auth_api',
        scope_name: 'apex-auth_api.scope',
      },
    ]

    const apiResource = [
      {
        enabled: true,
        name: 'apex-auth_api',
        display_name: 'Resource for HMS apex',
        description: null,
        show_in_discovery_document: true,
      },
    ]

    const apiScope = [
      {
        enabled: true,
        name: 'apex-auth_api.scope',
        display_name: 'Scope for HMS apex',
        description: null,
        show_in_discovery_document: true,
        required: false,
        emphasize: false,
      },
    ]

    const clientAllowedScope = [
      {
        client_id: 'apex-auth_client',
        scope_name: 'offline_access',
      },
    ]

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
      Promise.all([
        scopes,
        redirectUrls,
        clientGrantTypes,
        queryInterface.sequelize.query(
          "UPDATE client SET always_include_user_claims_in_id_token = false, allow_offline_access = true WHERE client_id IN ('apex-auth_client')",
        ),
        queryInterface.bulkInsert('api_scope', apiScope, {}),
        queryInterface.bulkInsert('api_resource', apiResource, {}),
        queryInterface.bulkInsert('client_allowed_scope', clientAllowedScope, {}),
      ]).then(() => {
        Promise.all([
          clients,
          queryInterface.sequelize.query(
            "UPDATE client SET redirect_uri = 'https://tcqqxwk4o7udq5x-hgrdevatp.adb.eu-frankfurt-1.oraclecloudapps.com/ords/r/hms_app_app/test-island-is-authentication/signin-oidc' WHERE client_id IN ('apex-auth_client') AND redirect_uri IN ('https://tcqqxwk4o7udq5x-hgrdevatp.adb.eu-frankfurt-1.oraclecloudapps.com/ords/apex_authentication_callback')",
          ),
          queryInterface.bulkInsert('api_resource_scope', apiResourceScope, {}),
          queryInterface.bulkInsert(
            'api_resource_user_claim',
            apiResourceUserClaim,
            {},
          ),
          queryInterface.bulkInsert(
            'client_allowed_scope',
            client_allowed_scope,
            {},
          ),
        ]).then(() => {
          resolve('done')
        })
      })
    })
  },
}
