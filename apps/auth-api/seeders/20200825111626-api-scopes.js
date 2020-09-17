'use strict';
/* eslint-env node */
/* eslint-disable @typescript-eslint/camelcase */

module.exports = {
  up: (queryInterface) => {

    const domainId = 'e3888706-8ad9-47af-8cb4-d69f04911aea'

    const scopes = [
      {
        domain_id: domainId,
        name: 'swagger_api.read',
        display_name: 'swagger_api.read',
        required: false,
        emphasize: false,
        enabled: true,
        show_in_discovery_document: true
      },
      {
        domain_id: domainId,
        name: 'postman_resource.scope',
        display_name: 'postman_resource.scope',
        required: false,
        emphasize: false,
        enabled: true,
        show_in_discovery_document: true
      },
      {
        domain_id: domainId,
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
