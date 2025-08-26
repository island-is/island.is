'use strict'

const api_resource = {
  enabled: true,
  name: '@island.is',
  display_name: 'Island.is api.',
  description: null,
  show_in_discovery_document: false,
}

const api_resources = [api_resource]

const api_scope_applications_read = {
  enabled: true,
  name: '@island.is/applications:read',
  display_name: 'Read applications',
  description: null,
  show_in_discovery_document: false,
  required: false,
  emphasize: false,
  grant_to_legal_guardians: true,
  grant_to_procuring_holders: true,
  allow_explicit_delegation_grant: true,
  also_for_delegated_user: false,
  automatic_delegation_grant: false,
  is_access_controlled: false,
  domain_name: '@island.is',
}

const api_scope_documents = {
  enabled: true,
  name: '@island.is/documents',
  display_name: 'Documents',
  description: null,
  show_in_discovery_document: false,
  required: false,
  emphasize: false,
  grant_to_legal_guardians: true,
  grant_to_procuring_holders: true,
  allow_explicit_delegation_grant: true,
  also_for_delegated_user: false,
  automatic_delegation_grant: false,
  is_access_controlled: false,
  domain_name: '@island.is',
}

const api_scopes = [api_scope_applications_read, api_scope_documents]

const api_resource_scopes = [
  {
    api_resource_name: api_resource.name,
    scope_name: api_scope_applications_read.name,
  },
]

const api_resource_user_claims = [
  {
    api_resource_name: api_resource.name,
    claim_name: 'nationalId',
  },
]

const client = {
  client_id: '@island.is/web',
  client_type: 'spa',
  require_client_secret: false,
  enable_local_login: true,
  require_pkce: true,
  allow_offline_access: false,

  //defaults
  identity_token_lifetime: 300,
  access_token_lifetime: 600,
  authorization_code_lifetime: 300,
  absolute_refresh_token_lifetime: 36000,
  sliding_refresh_token_lifetime: 7200,
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
  client_claims_prefix: '@island.is/auth-admin-web_',
  protocol_type: 'oidc',
  consent_lifetime: 3600,
  supports_custom_delegation: true,
  supports_legal_guardians: true,
  supports_procuring_holders: true,
  prompt_delegations: true,
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
    scope_name: api_scope_applications_read.name,
  },
  {
    client_id: client.client_id,
    scope_name: api_scope_documents.name,
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
  {
    client_id: client.client_id,
    redirect_uri:
      'https://auth-admin-web.dev01.devland.is/api/auth/callback/identity-server',
  },
  {
    client_id: client.client_id,
    redirect_uri:
      'https://auth-admin-web.staging01.devland.is/api/auth/callback/identity-server',
  },
]

const client_post_logout_redirect_uris = [
  {
    client_id: client.client_id,
    redirect_uri: 'http://localhost:4200',
  },
  {
    client_id: client.client_id,
    redirect_uri: 'https://auth-admin-web.dev01.devland.is',
  },
  {
    client_id: client.client_id,
    redirect_uri: 'https://auth-admin-web.staging01.devland.is',
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
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction()

    try {
      await queryInterface.bulkInsert('api_resource', api_resources, {
        transaction,
      })
      await queryInterface.bulkInsert(
        'api_resource_user_claim',
        api_resource_user_claims,
        { transaction },
      )
      await queryInterface.bulkInsert('api_scope', api_scopes, { transaction })
      await queryInterface.bulkInsert(
        'api_resource_scope',
        api_resource_scopes,
        { transaction },
      )

      await queryInterface.bulkInsert('client', clients, { transaction })
      await queryInterface.bulkInsert('client_secret', client_secrets, {
        transaction,
      })
      await queryInterface.bulkInsert('client_grant_type', client_grant_types, {
        transaction,
      })
      await queryInterface.bulkInsert(
        'client_allowed_scope',
        client_allowed_scopes,
        { transaction },
      )
      await queryInterface.bulkInsert(
        'client_redirect_uri',
        client_redirect_uris,
        { transaction },
      )
      await queryInterface.bulkInsert(
        'client_post_logout_redirect_uri',
        client_post_logout_redirect_uris,
        { transaction },
      )
    } catch (err) {
      await transaction.rollback()
      throw err
    }

    await transaction.commit()
  },

  down: async (queryInterface, Sequelize) => {
    // Do nothing
  },
}
