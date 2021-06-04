'use strict'

module.exports = {
  up: (queryInterface) => {
    return queryInterface.sequelize.query(`
      BEGIN;

        ALTER TABLE flight_leg ADD COLUMN is_connecting_flight BOOLEAN NOT NULL DEFAULT FALSE;

      COMMIT;
    `)
  },

  down: (queryInterface) => {
    return queryInterface.sequelize.query(`
      ALTER TABLE flight_leg DROP COLUMN is_connecting_flight;
    `)
  },
}
