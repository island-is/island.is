'use strict'
/* eslint-env node */
/* eslint-disable @typescript-eslint/camelcase */

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('client_allowed_cors_origin', [
      {
        client_id: 'island-is-1',
        origin: 'https://service-portal.staging01.devland.is',
      },
      {
        client_id: 'island-is-1',
        origin: 'https://umsoknir.staging01.devland.is',
      },
      {
        client_id: 'island-is-1',
        origin: 'https://beta.minarsidur.island.is',
      },
    ])
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('client_allowed_cors_origin', [
      {
        client_id: 'island-is-1',
        origin: 'https://service-portal.staging01.devland.is',
      },
      {
        client_id: 'island-is-1',
        origin: 'https://umsoknir.staging01.devland.is',
      },
      {
        client_id: 'island-is-1',
        origin: 'https://beta.minarsidur.island.is',
      },
    ])
  },
}
