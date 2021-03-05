'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(
      'UPDATE identity_resource SET grant_to_legal_guardians = false, grant_to_procuring_holders = false, allow_explicit_delegation_grant = false, automatic_delegation_grant = false, also_for_delegated_user = false',
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(
      'UPDATE identity_resource SET grant_to_legal_guardians = null, grant_to_procuring_holders = null, allow_explicit_delegation_grant = null, automatic_delegation_grant = null, also_for_delegated_user = null',
    )
  },
}
