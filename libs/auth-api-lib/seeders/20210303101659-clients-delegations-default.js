'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(
      'UPDATE client SET supports_delegation = false, supports_legal_guardians = false, supports_procuring_holders = false, prompt_delegations = false',
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(
      'UPDATE client SET supports_delegation = null, supports_legal_guardians = null, supports_procuring_holders = null, prompt_delegations = null',
    )
  },
}
