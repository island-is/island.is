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

    var redirectUri = [
      {
        client_id: 'postman',
        redirect_uri: 'https://localhost:5001/signin-adfs'
      },
      {
        client_id: 'postman',
        redirect_uri: 'https://postman'
      },
      {
        client_id: 'postman',
        redirect_uri: 'https://oauth.pstmn.io/v1/callback'
      },
    ];

    var secrets = [{
      client_id: 'postman',
      value: 'postman-secret',
      description: "secret for postman",
      expiration: new Date(),
      type: "Mobile app"
    },
    {
      client_id: 'postman',
      value: 'postman-secret-2',
      description: "second secret for postman",
      expiration: new Date(),
      type: "Native app"
    },
    ];

    var postRedirects = [{
      client_id: "postman",
      redirect_uri: "localhost:8080"
    }];

    var clientGrantTypes = [{
      client_id: 'postman',
      grant_type: 'authorization_code',
    }];


    return new Promise((resolve, reject) => {
      queryInterface.bulkInsert('client', clients, {}).then(result => {
        Promise.all([
          queryInterface.bulkInsert('client_allowed_scope', scopes, {}),
          queryInterface.bulkInsert('client_allowed_cors_origin', cors, {}),
          queryInterface.bulkInsert('client_idp_restrictions', clientIdbRestrictions, {}),
          queryInterface.bulkInsert('client_redirect_uri', redirectUri, {}),
          queryInterface.bulkInsert('client_secret', secrets, {}),
          queryInterface.bulkInsert('client_post_logout_redirect_uri', postRedirects, {}),
          queryInterface.bulkInsert('client_grant_type', clientGrantTypes, {})
        ]).then(result => {
          resolve("done");
        })
      })
    })
  },

  down: (queryInterface, Sequelize) => {
    var redirectUris = queryInterface.bulkDelete('client_redirect_uri', null, {})
    var idpRestrictions = queryInterface.bulkDelete('client_idp_restrictions', null, {})
    var cors = queryInterface.bulkDelete('client_allowed_cors_origin', null, {})
    var scopes = queryInterface.bulkDelete('client_allowed_scope', null, {})
    var secrets = queryInterface.bulkDelete('client_secret', null, {})
    var postLogoutUris = queryInterface.bulkDelete('client_post_logout_redirect_uri', null, {})
    var clients = queryInterface.bulkDelete('client', null, {})
    var grantTypes = queryInterface.bulkDelete('client_grant_type', null, {})

    return new Promise((resolve, reject) => {
      Promise.all([cors, scopes, idpRestrictions, redirectUris, secrets, postLogoutUris, grantTypes]).then(result => {
        clients.then(result => {
          resolve("done");
        })
      })
    })
  },
};
