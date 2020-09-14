'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {

    var apiResources = [
      {
        id: '241d6525-8544-4661-ab0b-541c00ae107f',//uuidv4(),
        name: 'swagger_api',
        display_name: 'Demo API',
        enabled: true,
        show_in_discovery_document: true
      },
      {
        id: 'c2f1c57f-a9a2-41d3-b647-d62f0fa3e4d2',//uuidv4(),
        name: 'postman_resource',
        display_name: 'postman_resource',
        enabled: true,
        show_in_discovery_document: true
      },
    ]

    var userClaims = [
      {api_resource_id: apiResources[1].id, claim_name: 'natreg'},
    ];

    var scopes = [
      {api_resource_id: apiResources[0].id, scope_name: 'swagger_api.read'},
      {api_resource_id: apiResources[1].id, scope_name: 'postman_resource.scope'},
    ]

    var secrets = [
      {api_resource_id: apiResources[1].id, value: '8I04CDGgyV5bddUZfz0ydCTBRuRTmn7frlxVhJy1krc=', type: 'SharedSecret'},
    ]

    return new Promise((resolve, reject) => {
      queryInterface.bulkInsert('api_resource', apiResources, {}).then(result => {
        Promise.all([
          queryInterface.bulkInsert('api_resource_user_claim', userClaims, {}),
          queryInterface.bulkInsert('api_resource_scope', scopes, {}),
          queryInterface.bulkInsert('api_resource_secret', secrets, {})
        ]).then(result => {
          resolve("done");
        })
      })
    })
  },

  down: (queryInterface, Sequelize) => {

    var secrets =  queryInterface.bulkDelete('api_resource_secret', null, {});
    var scopes =  queryInterface.bulkDelete('api_resource_scope', null, {});
    var userClaims =  queryInterface.bulkDelete('api_resource_user_claim', null, {});
    var apiResources =  queryInterface.bulkDelete('api_resource', null, {});

    return new Promise((resolve, reject) => {
      Promise.all([userClaims, scopes, secrets]).then(result => {
        apiResources.then(result => {
          resolve("done");
        })
      })
    })
  }
};
