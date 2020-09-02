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
        update_at_claims_on_refresh: 'Y',
        refresh_token_expiration: 0,
        access_token_type: 0,
        enable_local_login: 'Y',
        include_jwt_id: 'Y',
        always_send_client_claims: 'N',
        device_code_lifetime: 300,
        always_include_uc_in_id_token: 'N',
        back_channel_logout_session_rq: 'Y',
        enabled: 'Y',
        require_consent: 'N',
        require_pkce: 'N',
        allow_plain_text_pkce: 'N',
        allow_access_token_via_browser: 'N',
        front_channel_logout_session_rq: 'Y',
        allow_remember_consent: 'Y',
        client_claims_prefix: 'client_',
        protocol_type: 'oidc',
        require_client_secret: 'Y',
        enable_mobile_login: 'N',
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

    var cors = [
      {
        client_id: 'postman',
        origin: 'localhost'
      }
    ];

    var clientIdbRestrictions = [
      {
      name: "islykill", 
      client_id: "postman",
      },
      {
        name: "dockobit", 
        client_id: "postman",
      }
    ];


    return Promise.all([
      queryInterface.bulkInsert('client', clients, {}), 
      queryInterface.bulkInsert('client_allowed_scope', scopes, {}),
      queryInterface.bulkInsert('client_allowed_cors_origin', cors, {}),
      queryInterface.bulkInsert('client_idp_restrictions', clientIdbRestrictions, {}),
      
    ]);
  },

  down: (queryInterface, Sequelize) => {
    var idpRestrictions = queryInterface.bulkDelete('client_idp_restrictions', clientIdbRestrictions, {})
    var cors = queryInterface.bulkDelete('client_allowed_cors_origin', null, {})
    var scopes = queryInterface.bulkDelete('client_allowed_scope', null, {})
    var clients = queryInterface.bulkDelete('client', null, {})
    return Promise.all([cors, scopes, clients, idpRestrictions])
  }
};
