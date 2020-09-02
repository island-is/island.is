'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    var clients = [
      {
        client_id: 'postman',
        require_client_secret: false,
        require_pkce: false,

        //defaults
        allow_offline_access: 'N',
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
        require_pkce: true,
        allow_plain_text_pkce: false,
        allow_access_token_via_browser: true,
        front_channel_logout_session_required: true,
        allow_remember_consent: true,
        client_claims_prefix: 'client_',
        protocol_type: 'oidc',
        require_client_secret: true,
      }
    ];

    var scopes = [
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
    ];

    return Promise.all([queryInterface.bulkInsert('client', clients, {}), queryInterface.bulkInsert('client_allowed_scope', scopes, {})]);
  },

  down: (queryInterface, Sequelize) => {

    var clients = queryInterface.bulkDelete('client', null, {});
    return Promise.all([clients])
  }
};
