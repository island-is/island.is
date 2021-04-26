'use strict'
/* eslint-env node */
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable no-undef */

module.exports = {
  up: (queryInterface) => {
    const clients = [
      {
        client_id: '@island.is-app',
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
        supports_delegation: false,
        supports_legal_guardians: false,
        supports_procuring_holders: false,
        prompt_delegations: false,
      },
    ]

    const scopes = [
      {
        client_id: '@island.is-app',
        scope_name: 'openid',
      },
      {
        client_id: '@island.is-app',
        scope_name: 'api_resource.scope',
      },
      {
        client_id: '@island.is-app',
        scope_name: 'profile',
      },
      {
        client_id: '@island.is-app',
        scope_name: '@island.is/applications:read',
      },
      {
        client_id: '@island.is-app',
        scope_name: '@identityserver.api/read',
      },
      {
        client_id: '@island.is-app',
        scope_name: 'api',
      },
    ]

    const redirectUri = [
      {
        client_id: '@island.is-app',
        redirect_uri: 'https://localhost:4200/signin-oidc',
      },
      {
        client_id: '@island.is-app',
        redirect_uri: 'ttps://localhost:3000/auth/signin',
      },
      {
        client_id: '@island.is-app',
        redirect_uri: 'is.island.app-dev://oauth',
      },
      {
        client_id: '@island.is-app',
        redirect_uri: 'is.island.app.dev://oauth',
      },
      {
        client_id: '@island.is-app',
        redirect_uri: 'is.island.appDev://oauth',
      },
      {
        client_id: '@island.is-app',
        redirect_uri: 'is.island.app://oauth',
      },
    ]

    const clientGrantTypes = [
      {
        client_id: '@island.is-app',
        grant_type: 'authorization_code',
      },
    ]

    return new Promise((resolve) => {
      queryInterface.bulkInsert('client', clients, {}).then(() => {
        Promise.all([
          queryInterface.bulkInsert('client_allowed_scope', scopes, {}),
          queryInterface.bulkInsert('client_redirect_uri', redirectUri, {}),
          queryInterface.bulkInsert('client_grant_type', clientGrantTypes, {}),
        ]).then(() => {
          resolve('done')
        })
      })
    })
  },

  down: (queryInterface) => {
    const redirectUris = queryInterface.bulkDelete('client_redirect_uri', [
      {
        client_id: '@island.is-app',
        redirect_uri: 'https://localhost:4200/signin-oidc',
      },
      {
        client_id: '@island.is-app',
        redirect_uri: 'ttps://localhost:3000/auth/signin',
      },
      {
        client_id: '@island.is-app',
        redirect_uri: 'is.island.app-dev://oauth',
      },
      {
        client_id: '@island.is-app',
        redirect_uri: 'is.island.app.dev://oauth',
      },
      {
        client_id: '@island.is-app',
        redirect_uri: 'is.island.appDev://oauth',
      },
      {
        client_id: '@island.is-app',
        redirect_uri: 'is.island.app://oauth',
      },
    ])

    const scopes = queryInterface.bulkDelete('client_allowed_scope', [
      {
        client_id: '@island.is-app',
        scope_name: 'openid',
      },
      {
        client_id: '@island.is-app',
        scope_name: 'api_resource.scope',
      },
      {
        client_id: '@island.is-app',
        scope_name: 'profile',
      },
      {
        client_id: '@island.is-app',
        scope_name: '@island.is/applications:read',
      },
      {
        client_id: '@island.is-app',
        scope_name: '@identityserver.api/read',
      },
      {
        client_id: '@island.is-app',
        scope_name: 'api',
      },
    ])
    const clients = queryInterface.bulkDelete('client', [
      {
        client_id: '@island.is-app',
      },
    ])
    const grantTypes = queryInterface.bulkDelete('client_grant_type', [
      {
        client_id: '@island.is-app',
        grant_type: 'authorization_code',
      },
    ])

    return new Promise((resolve) => {
      Promise.all([scopes, redirectUris, grantTypes]).then(() => {
        clients.then(() => {
          resolve('done')
        })
      })
    })
  },
}
