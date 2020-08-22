'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {

    var openId = {
      id: 'a57a3c0d-2645-44fd-950e-f3a7fb23ee8e',//uuidv4(),
      name: 'openid',
      display_name: 'Your user identifier',
      required: true,
      enabled: true,
      show_in_discovery_document: true
    };

    var openIdClaims = [
      {identity_resource_id: openId.id, claim_name: 'sub'},
      {identity_resource_id: openId.id, claim_name: 'nat'},
      {identity_resource_id: openId.id, claim_name: 'natreg'}
    ];

    var identities = queryInterface.bulkInsert('identity_resource', [openId], {});

    var userClaims = queryInterface.bulkInsert('identity_resource_user_claim', openIdClaims, {});

    return Promise.all([identities, userClaims])
  },

  down: (queryInterface, Sequelize) => {

    var userClaims =  queryInterface.bulkDelete('identity_resource_user_claim', null, {});
    var identities =  queryInterface.bulkDelete('identity_resource', null, {});

    return Promise.all([identities, userClaims])
  }
};
