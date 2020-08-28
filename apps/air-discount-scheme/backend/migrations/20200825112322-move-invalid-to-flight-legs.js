'use strict'

module.exports = {
  up: (queryInterface) => {
    return queryInterface.sequelize.query(`
      BEGIN;

        DROP INDEX national_id_and_invalid_idx;
        ALTER TABLE flight DROP COLUMN invalid;
        ALTER TABLE flight_leg ADD COLUMN financial_state VARCHAR DEFAULT 'awaitingDebit' NOT NULL;

      COMMIT;
    `)
  },

  down: (queryInterface) => {
    return queryInterface.sequelize.query(`
        ALTER TABLE flight ADD COLUMN invalid BOOLEAN DEFAULT FALSE;
        ALTER TABLE flight_leg DROP COLUMN financial_state;
        CREATE INDEX national_id_and_invalid_idx ON flight (national_id, invalid);
    `)
  },
}
