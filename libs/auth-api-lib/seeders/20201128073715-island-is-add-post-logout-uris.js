'use strict'
/* eslint-env node */
/* eslint-disable @typescript-eslint/camelcase */

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('client_post_logout_redirect_uri', [
      {
        client_id: 'island-is-1',
        redirect_uri: 'https://service-portal.staging01.devland.is',
      },
      {
        client_id: 'island-is-1',
        redirect_uri: 'https://umsoknir.staging01.devland.is',
      },
      {
        client_id: 'island-is-1',
        redirect_uri: 'https://beta.minarsidur.island.is',
      },
    ])
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('client_post_logout_redirect_uri', [
      {
        client_id: 'island-is-1',
        redirect_uri: 'https://service-portal.staging01.devland.is',
      },
      {
        client_id: 'island-is-1',
        redirect_uri: 'https://umsoknir.staging01.devland.is',
      },
      {
        client_id: 'island-is-1',
        redirect_uri: 'https://beta.minarsidur.island.is',
      },
    ])
  },
}
