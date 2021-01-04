'use strict'

const api_resource = {
  enabled: true,
  name: 'auth-admin-api',
  display_name: 'The auth admin backend.',
  description: null,
  show_in_discovery_document: false,
}

const api_resources = [api_resource]

const api_scope = {
  enabled: true,
  name: 'auth-admin-api.full_control',
  display_name: 'Full access to the auth admin backend.',
  description: null,
  show_in_discovery_document: false,
  required: false,
  emphasize: false,
}

const api_scopes = [api_scope]

const api_resource_scopes = [
  {
    api_resource_name: api_resource.name,
    scope_name: api_scope.name,
  },
]

const client = {
  client_id: 'ids-admin',
  require_client_secret: true,
  enable_local_login: true,
  require_pkce: false,
  allow_offline_access: false,

  //defaults
  identity_token_lifetime: 300,
  access_token_lifetime: 600,
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
  allow_access_token_via_browser: false,
  front_channel_logout_session_required: true,
  allow_remember_consent: true,
  client_claims_prefix: 'ids-admin_',
  protocol_type: 'oidc',
  consent_lifetime: 3600,
}

const clients = [client]

const client_allowed_scopes = [
  {
    client_id: client.client_id,
    scope_name: 'openid',
  },
  {
    client_id: client.client_id,
    scope_name: 'profile',
  },
  {
    client_id: client.client_id,
    scope_name: api_scope.name,
  },
]

const client_grant_types = [
  {
    client_id: client.client_id,
    grant_type: 'authorization_code',
  },
]

const client_redirect_uris = [
  {
    client_id: client.client_id,
    redirect_uri: 'http://localhost:4200/api/auth/callback/identity-server',
  },
]

const client_secrets = [
  {
    client_id: client.client_id,
    value: 'P+W04fL1Bwpc5+FwAd1LmhC02J8XvapBI1dHQcLih/E=',
    expiration: null,
    type: 'SharedSecret',
  },
]

module.exports = {
  up: (queryInterface, Sequelize) => {
    return new Promise((resolve) => {
      Promise.all([
        queryInterface.bulkInsert('api_resource', api_resources, {}),
        queryInterface.bulkInsert('api_scope', api_scopes, {}),
      ])
        .then(
          Promise.all([
            queryInterface.bulkInsert(
              'api_resource_scope',
              api_resource_scopes,
              {},
            ),
            queryInterface.bulkInsert('client', clients, {}),
          ]),
        )
        .then(() => {
          Promise.all([
            queryInterface.bulkInsert(
              'client_allowed_scope',
              client_allowed_scopes,
              {},
            ),
            queryInterface.bulkInsert(
              'client_grant_type',
              client_grant_types,
              {},
            ),
            queryInterface.bulkInsert(
              'client_redirect_uri',
              client_redirect_uris,
              {},
            ),
            queryInterface.bulkInsert('client_secret', client_secrets, {}),
          ]).then(() => resolve('done'))
        })
    })
  },

  down: (queryInterface, Sequelize) => {
    return new Promise((resolve) => {
      Promise.all([
        queryInterface.bulkDelete(
          'client_allowed_scope',
          client_allowed_scopes,
          {},
        ),
        queryInterface.bulkDelete('client_grant_type', client_grant_types, {}),
        queryInterface.bulkDelete(
          'client_redirect_uri',
          client_redirect_uris,
          {},
        ),
        queryInterface.bulkDelete('client_secret', client_secrets, {}),
      ])
        .then(
          Promise.all([
            queryInterface.bulkDelete(
              'api_resource_scope',
              api_resource_scopes,
              {},
            ),
            queryInterface.bulkDelete('client', clients, {}),
          ]),
        )
        .then(() => {
          Promise.all([
            queryInterface.bulkDelete('api_resource', api_resources, {}),
            queryInterface.bulkDelete('api_scope', api_scopes, {}),
          ]).then(() => resolve('done'))
        })
    })
  },
}
