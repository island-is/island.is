'use strict'
/* eslint-env node */
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable no-undef */

module.exports = {
  up: (queryInterface) => {
    const grantTypes = [
      {
        name: 'authorization_code',
        description:
          'The Authorization Code grant type is used by confidential and public clients to exchange an authorization code for an access token.',
        created: new Date(),
        modified: new Date(),
      },
      {
        name: 'client_credentials',
        description:
          'The Client Credentials grant type is used by clients to obtain an access token outside of the context of a user.',
        created: new Date(),
        modified: new Date(),
      },
    ]

    return queryInterface.bulkInsert('grant_type', grantTypes, {})
  },

  down: (queryInterface) => {
    const grantTypes = queryInterface.bulkDelete('grant_type', null, {})

    return Promise.all([grantTypes])
  },
}
