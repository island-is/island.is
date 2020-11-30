'use strict'

module.exports = {
  up: (queryInterface) => {
    const redirectUri = [
      {
        client_id: 'island-is-1',
        redirect_uri: 'https://localhost:5001/oauth2-redirect.html',
      },
    ]

    const clientAllowedScope = [
      {
        client_id: 'island-is-client-cred-1',
        scope_name: 'api_resource.scope',
      },
    ]

    if (process.env.SUPPORT_LOCALHOST_AUTH === 'true') {
      return new Promise((resolve) => {
        queryInterface
          .bulkInsert('client_redirect_uri', redirectUri, {})
          .then(() => {
            queryInterface.bulkInsert(
              'client_allowed_scope',
              clientAllowedScope,
              {},
            )
          })
      })
    } else {
      return new Promise(function (resolve, reject) {
        setTimeout(() => resolve('done'), 100)
      })
    }
  },

  down: (queryInterface, Sequelize) => {
    if (process.env.SUPPORT_LOCALHOST_AUTH === 'true') {
      return new Promise((resolve) => {
        queryInterface
          .bulkDelete('client_redirect_uri', {
            client_id: 'island-is-1',
            redirect_uri: 'https://localhost:5001/oauth2-redirect.html',
          })
          .then(() => {
            return queryInterface.bulkDelete('client_allowed_scope', {
              client_id: 'island-is-client-cred-1',
              scope_name: 'api_resource.scope',
            })
          })
      })
    } else {
      return new Promise(function (resolve, reject) {
        setTimeout(() => resolve('done'), 100)
      })
    }
  },
}
