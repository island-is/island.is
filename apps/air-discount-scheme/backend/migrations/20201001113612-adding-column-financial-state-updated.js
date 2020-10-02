'use strict'

module.exports = {
  up: (queryInterface) => {
    return queryInterface.sequelize.query(`
      BEGIN;

        /* add date column to flight_leg */
        ALTER TABLE flight_leg
        ADD COLUMN financial_state_updated TIMESTAMP DEFAULT now();

        /* set fincancial_state_updated to same value as modified */
        UPDATE flight_leg
        SET financial_state_updated = modified;

      COMMIT;
    `)
  },

  down: (queryInterface) => {
    return queryInterface.sequelize.query(`
      ALTER TABLE flight DROP COLUMN financial_state_updated;
    `)
  },
}
