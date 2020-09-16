'use strict';
/* eslint-env node */
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable no-undef */

module.exports = {
  up: (queryInterface) => {

    const grantTypes = [
      {
        id: 'aa3978a9-027b-48c2-81d5-147262bd2032',//uuidv4(),
        name: 'authorization_code',
        description: 'The Authorization Code grant type is used by confidential and public clients to exchange an authorization code for an access token.',
        created: new Date(),
        modified: new Date()
      },
      {
        id: '99a94b84-e95b-4ed6-a326-9fc9a13921dc',//uuidv4(),
        name: 'client_credentials',
        description: 'The Client Credentials grant type is used by clients to obtain an access token outside of the context of a user.',
        created: new Date(),
        modified: new Date()
      }
    ]

    return queryInterface.bulkInsert('grant_type', grantTypes, {})
  },

  down: (queryInterface) => {

    const grantTypes =  queryInterface.bulkDelete('grant_type', null, {});

    return Promise.all([grantTypes])
  }
};
