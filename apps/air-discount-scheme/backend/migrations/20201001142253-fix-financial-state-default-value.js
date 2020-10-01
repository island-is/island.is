'use strict'

module.exports = {
  up: (queryInterface) => {
    return queryInterface.sequelize.query(`
      BEGIN;

        ALTER TABLE flight_leg ALTER COLUMN financial_state SET DEFAULT 'AWAITING_DEBIT';

      COMMIT;
    `)
  },

  down: (queryInterface) => {
    return queryInterface.sequelize.query(`
      ALTER TABLE flight_leg ALTER COLUMN financial_state SET DEFAULT 'awaitingDebit';
    `)
  },
}
