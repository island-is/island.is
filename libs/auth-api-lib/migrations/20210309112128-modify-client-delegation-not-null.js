'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
    BEGIN;
      UPDATE client set
        supports_delegation = false
      WHERE supports_delegation is null;
      UPDATE client set
        supports_legal_guardians = false
      WHERE supports_legal_guardians is null;
      UPDATE client set
        supports_procuring_holders = false
      WHERE supports_procuring_holders is null;
      UPDATE client set
        prompt_delegations = false
      WHERE prompt_delegations is null;
      
      ALTER TABLE client
      ALTER COLUMN supports_delegation SET NOT NULL,
      ALTER COLUMN supports_legal_guardians SET NOT NULL,
      ALTER COLUMN supports_procuring_holders SET NOT NULL,
      ALTER COLUMN prompt_delegations SET NOT NULL;
    COMMIT;
  `)
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
    BEGIN;
      ALTER TABLE client
      ALTER COLUMN supports_delegation DROP NOT NULL,
      ALTER COLUMN supports_legal_guardians DROP NOT NULL,
      ALTER COLUMN supports_procuring_holders DROP NOT NULL,
      ALTER COLUMN prompt_delegations DROP NOT NULL;
    COMMIT;
  `)
  },
}
