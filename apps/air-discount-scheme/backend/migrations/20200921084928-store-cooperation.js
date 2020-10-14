'use strict'

module.exports = {
  up: (queryInterface) => {
    return queryInterface.sequelize.query(`
      BEGIN;

        /* add nullable cooperation column to flight_leg */
        ALTER TABLE flight_leg ADD COLUMN cooperation VARCHAR;

        /* set cooperation where appropriate */
        UPDATE flight_leg
        SET cooperation = 'norlandair'
        WHERE airline = 'norlandair';

        /* set airline as icelandair where appropriate */
        UPDATE flight_leg
        SET airline = 'icelandair'
        WHERE airline = 'norlandair';

      COMMIT;
    `)
  },

  down: (queryInterface) => {
    return queryInterface.sequelize.query(`
        ALTER TABLE flight DROP COLUMN cooperation;
    `)
  },
}
