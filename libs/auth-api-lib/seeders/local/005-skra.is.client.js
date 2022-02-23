'use strict'

const skra_is_resource = {
  enabled: true,
  name: '@skra.is',
  display_name: 'Skra.is api.',
  description: null,
  show_in_discovery_document: false,
}

const api_resources = [skra_is_resource]

const skra_is_individuals_scope = {
  enabled: true,
  name: '@skra.is/individuals',
  display_name: 'Read individuals',
  description: null,
  show_in_discovery_document: false,
  required: false,
  emphasize: false,
  grant_to_legal_guardians: false,
  grant_to_procuring_holders: false,
  allow_explicit_delegation_grant: false,
  also_for_delegated_user: false,
  automatic_delegation_grant: false,
  is_access_controlled: false,
}

const api_resource_scope_tmp = {
  enabled: true,
  name: 'api_resource_tmp',
  display_name: 'Tmp, should remove',
  description: null,
  show_in_discovery_document: false,
  required: false,
  emphasize: false,
  grant_to_legal_guardians: false,
  grant_to_procuring_holders: false,
  allow_explicit_delegation_grant: false,
  also_for_delegated_user: false,
  automatic_delegation_grant: false,
  is_access_controlled: false,
}

const api_scopes = [skra_is_individuals_scope, api_resource_scope_tmp]

const api_resource_scopes = [
  {
    api_resource_name: skra_is_resource.name,
    scope_name: skra_is_individuals_scope.name,
  },
  {
    api_resource_name: skra_is_resource.name,
    scope_name: api_resource_scope_tmp.name,
  },
]

const api_resource_user_claims = [
  {
    api_resource_name: skra_is_resource.name,
    claim_name: 'nationalId',
  },
]

const client = {
  client_id: '@island.is/clients/national-registry',
  client_type: 'machine',
  require_client_secret: false,
  enable_local_login: true,
  require_pkce: false,
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
  client_claims_prefix: 'ids-admin_',
  protocol_type: 'oidc',
  consent_lifetime: 3600,

  supports_delegation: false,
  supports_legal_guardians: false,
  supports_procuring_holders: false,
  prompt_delegations: false,
}

const clients = [client]

const client_allowed_scopes = [
  {
    client_id: client.client_id,
    scope_name: 'openid',
  },
  {
    client_id: client.client_id,
    scope_name: skra_is_individuals_scope.name,
  },
  {
    client_id: client.client_id,
    scope_name: api_resource_scope_tmp.name,
  },
]

const client_grant_types = [
  {
    client_id: client.client_id,
    grant_type: 'urn:ietf:params:oauth:grant-type:token-exchange',
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
    } catch (err) {
      await transaction.rollback()
      throw err
    }

    transaction.commit()
  },

  down: async (queryInterface, Sequelize) => {
    // Do nothing
  },
}
