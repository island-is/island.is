'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('client_redirect_uri', [
      {
        client_id: 'island-is-1',
        redirect_uri: 'https://island.is/minarsidur/signin-oidc',
      },
      {
        client_id: 'island-is-1',
        redirect_uri: 'https://island.is/minarsidur/silent/signin-oidc',
      },
    ])
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('client_redirect_uri', [
      {
        client_id: 'island-is-1',
        redirect_uri: 'https://island.is/minarsidur/signin-oidc',
      },
      {
        client_id: 'island-is-1',
        redirect_uri: 'https://island.is/minarsidur/silent/signin-oidc',
      },
    ])
  },
}
