'use strict';
/* eslint-env node */
/* eslint-disable @typescript-eslint/camelcase */

module.exports = {
  up: (queryInterface) => {

    const scopes = [
      {
        id: 'aa3978a9-027b-48c2-81d5-147262bd3032',//uuidv4(),
        name: 'swagger_api.read',
        display_name: 'swagger_api.read',
        required: false,
        emphasize: false,
        enabled: true,
        show_in_discovery_document: true
      },
      {
        id: '99a94b84-e95b-4ed6-a326-9fc9a13921da',//uuidv4(),
        name: 'postman_resource.scope',
        display_name: 'postman_resource.scope',
        required: false,
        emphasize: false,
        enabled: true,
        show_in_discovery_document: true
      },
      {
        id: '3872e55c-3137-41c7-a4d9-700760477ce2',//uuidv4(),
        name: '@identityserver.api/read',
        display_name: '@identityserver.api/read',
        required: false,
        emphasize: false,
        enabled: true,
        show_in_discovery_document: true
      }
    ]

    return queryInterface.bulkInsert('api_scope', scopes, {})
  },

  down: (queryInterface) => {

    const userClaims =  queryInterface.bulkDelete('api_scope_user_claim', null, {});
    const apiScopes =  queryInterface.bulkDelete('api_scope', null, {});

    return userClaims.then(apiScopes)
  }
};
