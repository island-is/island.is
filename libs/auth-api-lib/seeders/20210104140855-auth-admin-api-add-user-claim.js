'use strict'

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
