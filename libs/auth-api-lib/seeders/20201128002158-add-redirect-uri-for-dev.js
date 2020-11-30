'use strict'

module.exports = {
  up: (queryInterface) => {
    const redirectUri = [
      {
        client_id: 'island-is-1',
        redirect_uri: 'https://localhost:5001/oauth2-redirect.html',
      },
    ]

    if (process.env.SeedEnvironment === 'development') {
      return queryInterface.bulkInsert('client_redirect_uri', redirectUri, {})
    } else {
      return new Promise(function (resolve, reject) {
        setTimeout(() => resolve('done'), 100)
      })
    }
  },

  down: (queryInterface, Sequelize) => {
    if (process.env.SeedEnvironment === 'development') {
      return queryInterface.bulkDelete('client_redirect_uri', {
        client_id: 'island-is-1',
        redirect_uri: 'https://localhost:5001/oauth2-redirect.html',
      })
    } else {
      return new Promise(function (resolve, reject) {
        setTimeout(() => resolve('done'), 100)
      })
    }
  },
}
