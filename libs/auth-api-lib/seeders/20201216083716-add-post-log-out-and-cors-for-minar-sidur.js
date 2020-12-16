'use strict'

module.exports = {
  up: (queryInterface) => {
    return new Promise((resolve) => {
      Promise.all([
        queryInterface.bulkInsert('client_allowed_cors_origin', [
          {
            origin: 'https://island.is',
            client_id: 'island-is-1',
          },
        ]),
        queryInterface.bulkInsert('client_post_logout_redirect_uri', [
          {
            redirect_uri: 'https://island.is/minarsidur',
            client_id: 'island-is-1',
          },
        ]),
      ]).then(() => {
        resolve('done')
      })
    })
  },

  down: (queryInterface, Sequelize) => {
    return new Promise((resolve) => {
      Promise.all([
        queryInterface.bulkDelete('client_allowed_cors_origin', [
          {
            origin: 'https://island.is',
            client_id: 'island-is-1',
          },
        ]),
        queryInterface.bulkDelete('client_post_logout_redirect_uri', [
          {
            redirect_uri: 'https://island.is/minarsidur',
            client_id: 'island-is-1',
          },
        ]),
      ]).then(() => {
        resolve('done')
      })
    })
  },
}
