'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {

    var grantTypes = [
      {
        id: 'aa3978a9-027b-48c2-81d5-147262bd2032',//uuidv4(),
        name: 'authorization_code',
        description: 'Authentication for users who have access to the system',
        created: new Date(),
        modified: new Date()
      },
      {
        id: '99a94b84-e95b-4ed6-a326-9fc9a13921dc',//uuidv4(),
        name: 'client_credentials',
        description: 'Authentication for services independent from uses who have access to the system. Requires client_secret',
        created: new Date(),
        modified: new Date()
      }
    ]

    return queryInterface.bulkInsert('grant_type', grantTypes, {})
  },

  down: (queryInterface, Sequelize) => {

    var grantTypes =  queryInterface.bulkDelete('grant_type', null, {});

    return Promise.all([grantTypes])
  }
};
