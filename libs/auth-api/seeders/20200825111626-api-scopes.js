'use strict';
/* eslint-env node */
/* eslint-disable @typescript-eslint/camelcase */

module.exports = {
  up: (queryInterface) => {

    const domains = [
      {
        name: '@island.is'
      },
    ]

    const scopes = [
      {
        domain: domains[0].name,
        name: 'swagger_api.read',
        display_name: 'swagger_api.read',
        required: false,
        emphasize: false,
        enabled: true,
        show_in_discovery_document: true
      },
      {
        domain: domains[0].name,
        name: 'postman_resource.scope',
        display_name: 'postman_resource.scope',
        required: false,
        emphasize: false,
        enabled: true,
        show_in_discovery_document: true
      },
      {
        domain: domains[0].name,
        name: '@identityserver.api/read',
        display_name: '@identityserver.api/read',
        required: false,
        emphasize: false,
        enabled: true,
        show_in_discovery_document: true
      }
    ]

    return queryInterface.bulkInsert('domain', domains, {}).then(queryInterface.bulkInsert('api_scope', scopes, {}))
  },

  down: (queryInterface) => {

    const userClaims =  queryInterface.bulkDelete('api_scope_user_claim', null, {});
    const apiScopes =  queryInterface.bulkDelete('api_scope', null, {});
    const domains = queryInterface.bulkDelete('domain', null, {});
    return domains.then(userClaims).then(apiScopes)
  }
};
