'use strict'
/* eslint-env node */
/* eslint-disable @typescript-eslint/camelcase */

module.exports = {
  up: (queryInterface) => {
    const secrets = [
      {
        client_id: 'island-is-client-cred-1',
        value: 'K7gNU3sdo+OL0wNhqoVWhr3g6s1xYv72ol/pe/Unols=',
        description: 'secret for island-is-client-cred-1',
        expiration: null,
        type: 'SharedSecret',
      },
    ]

    return new Promise((resolve) => {
      queryInterface
        .bulkDelete('client_secret', {
          client_id: 'island-is-client-cred-1',
        })
        .then(() => {
          Promise.all([
            queryInterface.bulkInsert('client_secret', secrets, {}),
          ]).then(() => {
            resolve('done')
          })
        })
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('client_secret', {
      value: 'K7gNU3sdo+OL0wNhqoVWhr3g6s1xYv72ol/pe/Unols=',
    })
  },
}
