'use strict';
/* eslint-env node */
/* eslint-disable @typescript-eslint/camelcase */

module.exports = {
  up: (queryInterface) => {

    const openId = {
      name: 'openid',
      display_name: 'Your user identifier',
      required: true,
      emphasize: false,
      enabled: true,
      show_in_discovery_document: true
    };

    const openIdClaims = [
      {identity_resource_name: openId.name, claim_name: 'sub'},
      {identity_resource_name: openId.name, claim_name: 'nat'},
      {identity_resource_name: openId.name, claim_name: 'natreg'}
    ];

    const profile = {
      name: 'profile',
      display_name: 'User profile',
      description: 'Your user profile information (first name, last name, etc.)',
      required: false,
      emphasize: true,
      enabled: true,
      show_in_discovery_document: true
    };

    const profileClaims = [
      {identity_resource_name: profile.name, claim_name: 'name'},
      {identity_resource_name: profile.name, claim_name: 'family_name'},
      {identity_resource_name: profile.name, claim_name: 'given_name'},
      {identity_resource_name: profile.name, claim_name: 'middle_name'},
      {identity_resource_name: profile.name, claim_name: 'nickname'},
      {identity_resource_name: profile.name, claim_name: 'preferred_username'},
      {identity_resource_name: profile.name, claim_name: 'profile'},
      {identity_resource_name: profile.name, claim_name: 'picture'},
      {identity_resource_name: profile.name, claim_name: 'website'},
      {identity_resource_name: profile.name, claim_name: 'gender'},
      {identity_resource_name: profile.name, claim_name: 'birthdate'},
      {identity_resource_name: profile.name, claim_name: 'zoneinfo'},
      {identity_resource_name: profile.name, claim_name: 'locale'},
      {identity_resource_name: profile.name, claim_name: 'updated_at'}
    ];

    const email = {
      name: 'email',
      display_name: 'Your email address',
      required: false,
      emphasize: true,
      enabled: true,
      show_in_discovery_document: true
    };

    const emailClaims = [
      {identity_resource_name: email.name, claim_name: 'email'},
      {identity_resource_name: email.name, claim_name: 'email_verified'},
    ];

    const phone = {
      name: 'phone',
      display_name: 'Your phone',
      required: false,
      emphasize: true,
      enabled: true,
      show_in_discovery_document: true}

    const phoneClaims = [
      {identity_resource_name: phone.name, claim_name: 'phone'},
      {identity_resource_name: phone.name, claim_name: 'phone_verified'},
    ]

    const address = {
      name: 'address',
      display_name: 'Your address',
      required: false,
      emphasize: true,
      enabled: true,
      show_in_discovery_document: true}

    const addressClaims = [
      {identity_resource_name: address.name, claim_name: 'address'},
    ]

    const identityResources = queryInterface.bulkInsert('identity_resource', [openId, profile, email, phone, address], {})

    const userClaims = queryInterface.bulkInsert('identity_resource_user_claim', openIdClaims.concat(profileClaims, emailClaims, phoneClaims, addressClaims), {})

    return identityResources.then(userClaims)
  },

  down: (queryInterface) => {

    const identityResources =  queryInterface.bulkDelete('identity_resource', null, {});
    const userClaims =  queryInterface.bulkDelete('identity_resource_user_claim', null, {});

    return userClaims.then(identityResources)
  }
};
