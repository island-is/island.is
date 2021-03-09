'use strict'
/* eslint-env node */
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable no-undef */

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(
      'UPDATE client SET supports_delegation = false, supports_legal_guardians = false, supports_procuring_holders = false, prompt_delegations = false',
    )
  },

  down: (queryInterface, Sequelize) => {
    return Promise.resolve([1])
  },
}
