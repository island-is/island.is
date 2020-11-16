'use strict'
/* eslint-env node */
/* eslint-disable @typescript-eslint/camelcase */

module.exports = {
  up: (queryInterface) => {
    const scopes = [
      {
        name: 'api',
        display_name: 'api',
        required: false,
        emphasize: false,
        enabled: true,
        show_in_discovery_document: true,
      },
    ]

    return queryInterface.bulkInsert('api_scope', scopes, {})
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('api_scope', {
      name: 'api',
    })
  },
}