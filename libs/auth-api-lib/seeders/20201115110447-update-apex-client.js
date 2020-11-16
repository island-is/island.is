'use strict'
/* eslint-env node */
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable no-undef */

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkUpdate(
      'client',
      { require_pkce: false },
      { client_id: 'apex-auth_client' },
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkUpdate(
      'client',
      { require_pkce: false },
      { client_id: 'apex-auth_client' },
    )
  },
}
