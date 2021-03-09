'use strict'
/* eslint-env node */
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable no-undef */

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(
      'UPDATE api_scope SET grant_to_legal_guardians = false, grant_to_procuring_holders = false, allow_explicit_delegation_grant = false, automatic_delegation_grant = false, also_for_delegated_user = false',
    )
  },

  down: (queryInterface, Sequelize) => {
    return Promise.resolve([1])
  },
}
