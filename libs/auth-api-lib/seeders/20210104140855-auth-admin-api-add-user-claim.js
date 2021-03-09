'use strict'
/* eslint-env node */
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable no-undef */

const api_resource_name = 'auth-admin-api'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('api_resource_user_claim', [
      {
        api_resource_name: api_resource_name,
        claim_name: 'nationalId',
      },
    ])
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('api_resource_user_claim', {
      api_resource_name: api_resource_name,
      claim_name: 'nationalId',
    })
  },
}
