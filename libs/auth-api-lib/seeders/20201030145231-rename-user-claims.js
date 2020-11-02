'use strict'
/* eslint-env node */
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable no-undef */

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkUpdate(
      'api_resource_user_claim',
      { claim_name: 'natreg' },
      { claim_name: 'nationalId' },
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkUpdate(
      'api_resource_user_claim',
      { claim_name: 'nationalId' },
      { claim_name: 'natreg' },
    )
  },
}
