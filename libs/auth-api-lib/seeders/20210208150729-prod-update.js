'use strict'

const island_client_id = 'island-is-1'
const hms_client_id = 'apex-auth_client'

const client_redirect_uri = [
  {
    client_id: island_client_id,
    redirect_uri: 'https://beta.island.is/minarsidur/signin-oidc',
  },
  {
    client_id: island_client_id,
    redirect_uri: 'https://beta.island.is/minarsidur/silent/signin-oidc',
  },
  {
    client_id: hms_client_id,
    redirect_uri: 'https://bg.hms.is/ords/apex_authentication.callback',
  },
  {
    client_id: hms_client_id,
    redirect_uri: 'https://apex.hms.is/ords/apex_authentication.callback',
  },
]

const allowed_cors_origin = [
  {
    client_id: island_client_id,
    origin: 'https://beta.island.is',
  },
]

module.exports = {
  up: (queryInterface, Sequelize) => {
    return new Promise((resolve) => {
      Promise.all([
        queryInterface.bulkInsert('client_redirect_uri', client_redirect_uri),
        queryInterface.bulkInsert(
          'client_allowed_cors_origin',
          allowed_cors_origin,
        ),
      ]).then(() => {
        resolve('done')
      })
    })
  },

  down: (queryInterface, Sequelize) => {
    return new Promise((resolve) => {
      Promise.all([
        queryInterface.bulkDelete('client_redirect_uri', {
          client_id: island_client_id,
          redirect_uri: 'https://beta.island.is/minarsidur/signin-oidc',
        }),
        queryInterface.bulkDelete('client_redirect_uri', {
          client_id: island_client_id,
          redirect_uri: 'https://beta.island.is/minarsidur/silent/signin-oidc',
        }),
        queryInterface.bulkDelete('client_allowed_cors_origin', {
          client_id: island_client_id,
          redirect_uri: 'https://beta.island.is',
        }),
        queryInterface.bulkDelete('client_redirect_uri', {
          client_id: hms_client_id,
          redirect_uri: 'https://bg.hms.is/ords/apex_authentication.callback',
        }),
        queryInterface.bulkDelete('client_redirect_uri', {
          client_id: hms_client_id,
          redirect_uri: 'https://apex.hms.is/ords/apex_authentication.callback',
        }),
      ]).then(() => {
        resolve('done')
      })
    })
  },
}
