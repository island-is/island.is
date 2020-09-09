'use strict'

module.exports = {
  up: (queryInterface) => {
    return queryInterface.sequelize.query(`
      BEGIN;

        /* add nullable airline column to flight_leg */
        ALTER TABLE flight_leg ADD COLUMN airline VARCHAR;

        /* copy airline from flight to flight_leg */
        UPDATE flight_leg
        SET airline = f.airline
        FROM flight f
        WHERE flight_id = f.id;

        /* set norlandair where appropriate */
        UPDATE flight_leg
        SET airline = 'norlandair'
        WHERE airline = 'icelandair'
          AND (
            (destination = 'VPN' OR destination = 'THO' OR destination = 'GRY')
            OR
            (origin = 'VPN' OR origin = 'THO' OR origin = 'GRY')
          );

        /* set not null for airline */
        ALTER TABLE flight_leg ALTER COLUMN airline SET NOT NULL;

      COMMIT;
    `)
  },

  down: (queryInterface) => {
    return queryInterface.sequelize.query(`
        ALTER TABLE flight_leg DROP COLUMN airline;
    `)
  },
}
