'use strict'

const client_id = 'ids-admin'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return new Promise((resolve) => {
      Promise.all([
        queryInterface.bulkInsert('client_post_logout_redirect_uri', [
          {
            client_id: client_id,
            redirect_uri: 'https://auth-admin-web.dev01.devland.is',
          },
          {
            client_id: client_id,
            redirect_uri: 'https://auth-admin-web.staging01.devland.is',
          },
          {
            client_id: client_id,
            redirect_uri: 'https://identity-server-admin.devland.is',
          },
        ]),
        queryInterface.bulkInsert('client_redirect_uri', [
          {
            client_id: client_id,
            redirect_uri:
              'https://auth-admin-web.dev01.devland.is/api/auth/callback/identity-server',
          },
          {
            client_id: client_id,
            redirect_uri:
              'https://auth-admin-web.staging01.devland.is/api/auth/callback/identity-server',
          },
          {
            client_id: client_id,
            redirect_uri:
              'https://identity-server-admin.devland.is/api/auth/callback/identity-server',
          },
        ]),
      ]).then(() => resolve('done'))
    })
  },

  down: (queryInterface, Sequelize) => {
    return new Promise((resolve) => {
      Promise.all([
        queryInterface.bulkDelete('client_post_logout_redirect_uri', {
          client_id: client_id,
          redirect_uri: 'https://auth-admin-web.dev01.devland.is',
        }),
        queryInterface.bulkDelete('client_post_logout_redirect_uri', {
          client_id: client_id,
          redirect_uri: 'https://auth-admin-web.staging01.devland.is',
        }),
        queryInterface.bulkDelete('client_post_logout_redirect_uri', {
          client_id: client_id,
          redirect_uri: 'https://identity-server-admin.devland.is',
        }),

        queryInterface.bulkDelete('client_redirect_uri', {
          client_id: client_id,
          redirect_uri:
            'https://auth-admin-web.dev01.devland.is/api/auth/callback/identity-server',
        }),
        queryInterface.bulkDelete('client_redirect_uri', {
          client_id: client_id,
          redirect_uri:
            'https://auth-admin-web.staging01.devland.is/api/auth/callback/identity-server',
        }),
        queryInterface.bulkDelete('client_redirect_uri', {
          client_id: client_id,
          redirect_uri:
            'https://identity-server-admin.devland.is/api/auth/callback/identity-server',
        }),
      ]).then(() => resolve('done'))
    })
  },
}
