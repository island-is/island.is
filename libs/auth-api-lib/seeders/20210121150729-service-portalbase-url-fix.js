'use strict'

const client_id = 'island-is-1'

const client_redirect_uri = [
  {
    client_id: client_id,
    redirect_uri:
      'https://service-portalbase-url-changes-beta.dev01.devland.is/signin-oidc',
  },
  {
    client_id: client_id,
    redirect_uri:
      'https://service-portalbase-url-changes-beta.dev01.devland.is/silent/signin-oidc',
  },
]

module.exports = {
  up: (queryInterface, Sequelize) => {
    return new Promise((resolve) => {
      Promise.all([
        queryInterface.bulkInsert('client_redirect_uri', client_redirect_uri),
        queryInterface.bulkDelete('client_redirect_uri', {
          client_id: client_id,
          redirect_uri:
            'https://service-portalbase-url-changes-beta.dev01.devland.is/minarsidur/signin-oidc',
        }),
        queryInterface.bulkDelete('client_redirect_uri', {
          client_id: client_id,
          redirect_uri:
            'https://service-portalbase-url-changes-beta.dev01.devland.is/minarsidur/silent/signin-oidc',
        }),
      ]).then(() => {
        resolve('done')
      })
    })
  },

  down: (queryInterface, Sequelize) => {
    return new Promise((resolve) => {
      Promise.all([
        queryInterface.bulkDelete('client_redirect_uri', {
          client_id: client_id,
          redirect_uri:
            'https://service-portalbase-url-changes-beta.dev01.devland.is/signin-oidc',
        }),
        queryInterface.bulkInsert('client_redirect_uri', {
          client_id: client_id,
          redirect_uri:
            'https://service-portalbase-url-changes-beta.dev01.devland.is/minarsidur/signin-oidc',
        }),
        queryInterface.bulkInsert('client_redirect_uri', {
          client_id: client_id,
          redirect_uri:
            'https://service-portalbase-url-changes-beta.dev01.devland.is/minarsidur/silent/signin-oidc',
        }),
      ]).then(() => {
        resolve('done')
      })
    })
  },
}
