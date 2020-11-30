'use strict'

module.exports = {
  up: (queryInterface) => {
    const clientAllowedScope = [
      {
        client_id: 'island-is-client-cred-1',
        scope_name: 'api_resource.scope',
      },
    ]

    if (process.env.SUPPORT_LOCALHOST_AUTH === 'true') {
      return queryInterface.bulkInsert(
        'client_allowed_scope',
        clientAllowedScope,
        {},
      )
    } else {
      return new Promise(function (resolve, reject) {
        setTimeout(() => resolve('done'), 100)
      })
    }
  },

  down: (queryInterface, Sequelize) => {
    if (process.env.SUPPORT_LOCALHOST_AUTH === 'true') {
      return queryInterface.bulkDelete('client_allowed_scope', {
        client_id: 'island-is-client-cred-1',
        scope_name: 'api_resource.scope',
      })
    } else {
      return new Promise(function (resolve, reject) {
        setTimeout(() => resolve('done'), 100)
      })
    }
  },
}
