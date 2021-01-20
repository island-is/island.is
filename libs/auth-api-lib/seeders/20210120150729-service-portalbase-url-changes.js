'use strict'

const client_id = 'island-is-1'

const client_redirect_uri = [
  {
    client_id: client_id,
    redirect_uri: 'https://service-portalbase-url-changes-beta.dev01.devland.is/minarsidur/signin-oidc',
  },
  {
    client_id: client_id,
    redirect_uri:
      'https://service-portalbase-url-changes-beta.dev01.devland.is/silent/minarsidur/signin-oidc',
  },
]

const client_allowed_cors_origin = [
  {
    client_id: client_id,
    origin: 'https://service-portalbase-url-changes-beta.dev01.devland.is',
  },
]

const client_post_logout_redirect_uri = [
  {
    client_id: client_id,
    redirect_uri: 'https://service-portalbase-url-changes-beta.dev01.devland.is/minarsidur',
  },
]

module.exports = {
  up: (queryInterface, Sequelize) => {
    return new Promise((resolve) => {
      Promise.all([
        queryInterface.bulkInsert('client_redirect_uri', client_redirect_uri),
        queryInterface.bulkInsert(
          'client_allowed_cors_origin',
          client_allowed_cors_origin,
        ),
        queryInterface.bulkInsert(
          'client_post_logout_redirect_uri',
          client_post_logout_redirect_uri,
        ),
      ]).then(() => {
        resolve('done')
      })
    })
  },

  down: (queryInterface, Sequelize) => {
    return new Promise((resolve) => {
      Promise.all([
        queryInterface.bulkDelete('client_redirect_uri', client_redirect_uri),
        queryInterface.bulkDelete(
          'client_allowed_cors_origin',
          client_allowed_cors_origin,
        ),
        queryInterface.bulkDelete(
          'client_post_logout_redirect_uri',
          client_post_logout_redirect_uri,
        ),
      ]).then(() => {
        resolve('done')
      })
    })
  },
}
