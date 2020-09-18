'use strict';
/* eslint-env node */
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable no-undef */

module.exports = {
  up: (queryInterface) => {

    const domain = '@island.is'

    const apiResources = [
      {
        domain: domain,
        name: 'swagger_api',
        display_name: 'Demo API',
        enabled: true,
        show_in_discovery_document: true
      },
      {
        domain: domain,
        name: 'postman_resource',
        display_name: 'postman_resource',
        enabled: true,
        show_in_discovery_document: true
      },
    ]

    const userClaims = [
      {domain: domain, api_resource_name: apiResources[1].name, claim_name: 'natreg'},
    ];

    const scopes = [
      {domain: domain, api_resource_name: apiResources[0].name, scope_name: 'swagger_api.read'},
      {domain: domain, api_resource_name: apiResources[1].name, scope_name: 'postman_resource.scope'},
    ]

    const secrets = [
      {domain: domain, api_resource_name: apiResources[1].name, value: '8I04CDGgyV5bddUZfz0ydCTBRuRTmn7frlxVhJy1krc=', type: 'SharedSecret'},
    ]

    return new Promise((resolve) => {
      queryInterface.bulkInsert('api_resource', apiResources, {}).then(() => {
        Promise.all([
          queryInterface.bulkInsert('api_resource_user_claim', userClaims, {}),
          queryInterface.bulkInsert('api_resource_scope', scopes, {}),
          queryInterface.bulkInsert('api_resource_secret', secrets, {})
        ]).then(() => {
          resolve("done");
        })
      })
    })
  },

  down: (queryInterface) => {

    const secrets =  queryInterface.bulkDelete('api_resource_secret', null, {});
    const scopes =  queryInterface.bulkDelete('api_resource_scope', null, {});
    const userClaims =  queryInterface.bulkDelete('api_resource_user_claim', null, {});
    const apiResources =  queryInterface.bulkDelete('api_resource', null, {});

    return new Promise((resolve) => {
      Promise.all([userClaims, scopes, secrets]).then(() => {
        apiResources.then(() => {
          resolve("done");
        })
      })
    })
  }
};
