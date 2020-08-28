'use strict'

module.exports = {
  up: (queryInterface) => {
    return queryInterface.sequelize.query(`
      BEGIN;

        CREATE TABLE flight_leg (
          id UUID NOT NULL,
          flight_id UUID NOT NULL,
          origin VARCHAR NOT NULL,
          destination VARCHAR NOT NULL,
          original_price INTEGER NOT NULL,
          discount_price INTEGER NOT NULL,
          date TIMESTAMP NOT NULL,
          created TIMESTAMP WITH TIME ZONE DEFAULT now(),
          modified TIMESTAMP WITH TIME ZONE,
          PRIMARY KEY (id),
          CONSTRAINT fk_flight
            FOREIGN KEY(flight_id)
              REFERENCES flight(id)
        );

      COMMIT;
    `)
  },

  down: (queryInterface) => {
    return queryInterface.sequelize.query(`
      DROP TABLE flight_leg;
    `)
  },
}
