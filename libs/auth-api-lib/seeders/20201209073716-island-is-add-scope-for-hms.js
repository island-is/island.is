'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    const apiResource = [
      {
        enabled: true,
        name: 'apex-auth_api',
        display_name: 'Resource for HMS apex',
        description: null,
        show_in_discovery_document: true,
      },
    ]

    const apiScope = [
      {
        enabled: true,
        name: 'apex-auth_api.scope',
        display_name: 'Scope for HMS apex',
        description: null,
        show_in_discovery_document: true,
        required: false,
        emphasize: false,
      },
    ]

    const apiResourceScope = [
      {
        api_resource_name: apiResource[0].name,
        scope_name: apiScope[0].name,
      },
    ]

    const resourceClaims = [
      {
        api_resource_name: apiResource[0].name,
        claim_name: 'nationalId',
      },
      {
        api_resource_name: apiResource[0].name,
        claim_name: 'name',
      },
    ]

    const clientAllowedScope = [
      {
        scope_name: apiScope[0].name,
        client_id: 'apex-auth_client',
      },
    ]

    return new Promise((resolve) => {
      Promise.all([
        queryInterface.bulkInsert('api_resource', apiResource, {}),
        queryInterface.bulkInsert('api_scope', apiScope, {}),
      ]).then(() => {
        Promise.all([
          queryInterface.bulkInsert('api_resource_scope', apiResourceScope, {}),
          queryInterface.bulkInsert(
            'api_resource_user_claim',
            resourceClaims,
            {},
          ),
          queryInterface.bulkInsert(
            'client_allowed_scope',
            clientAllowedScope,
            {},
          ),
        ]).then(() => {
          resolve('done')
        })
      })
    })
  },

  down: (queryInterface, Sequelize) => {
    const apiResource = queryInterface.bulkDelete('api_resource', [
      {
        enabled: true,
        name: 'apex-auth_api',
        display_name: 'Resource for HMS apex',
        description: null,
        show_in_discovery_document: true,
      },
    ])

    const apiScope = queryInterface.bulkDelete('api_scope', [
      {
        enabled: true,
        name: 'apex-auth_api.scope',
        display_name: 'Scope for HMS apex',
        description: null,
        show_in_discovery_document: true,
        required: false,
        emphasize: false,
      },
    ])

    const apiResourceScope = queryInterface.bulkDelete('api_resource_scope', [
      {
        api_resource_name: apiResource[0].name,
        scope_name: apiScope[0].name,
      },
    ])

    const resourceClaims = queryInterface.bulkDelete(
      'api_resource_user_claim',
      [
        {
          api_resource_name: apiResource[0].name,
          claim_name: 'nationalId',
        },
        {
          api_resource_name: apiResource[0].name,
          claim_name: 'name',
        },
      ],
    )

    const clientAllowedScope = queryInterface.bulkDelete(
      'client_allowed_scope',
      [
        {
          scope_name: apiScope[0].name,
          client_id: 'apex-auth_client',
        },
      ],
    )

    return new Promise((resolve) => {
      Promise.all([resourceClaims, apiResourceScope, clientAllowedScope]).then(
        () => {
          Promise.all([apiResource, apiScope]).then(() => {
            resolve('done')
          })
        },
      )
    })
  },
}
