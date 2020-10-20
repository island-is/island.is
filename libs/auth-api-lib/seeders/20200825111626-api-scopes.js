'use strict'
/* eslint-env node */
/* eslint-disable @typescript-eslint/camelcase */

module.exports = {
  up: (queryInterface) => {

    const scopes = [
      {
        name: 'swagger_api.read',
        display_name: 'swagger_api.read',
        required: false,
        emphasize: false,
        enabled: true,
        show_in_discovery_document: true,
      },
      {
        name: 'postman_resource.scope',
        display_name: 'postman_resource.scope',
        required: false,
        emphasize: false,
        enabled: true,
        show_in_discovery_document: true,
      },
      {
        name: '@identityserver.api/read',
        display_name: '@identityserver.api/read',
        required: false,
        emphasize: false,
        enabled: true,
        show_in_discovery_document: true,
      },
    ]

    return queryInterface.bulkInsert('api_scope', scopes, {})
  },

  down: (queryInterface) => {
    const userClaims = queryInterface.bulkDelete(
      'api_scope_user_claim',
      null,
      {},
    )

    return queryInterface.bulkDelete('api_scope', null, {})
  },
}
