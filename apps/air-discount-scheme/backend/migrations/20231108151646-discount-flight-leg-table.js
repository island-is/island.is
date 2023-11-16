'use strict'

module.exports = {
  up: (queryInterface) => {
    return queryInterface.sequelize.query(`
      BEGIN;

        CREATE TABLE discount_flight_leg (
          id UUID NOT NULL,
          discount_flight_id UUID NOT NULL,
          origin VARCHAR NOT NULL,
          destination VARCHAR NOT NULL,
          created TIMESTAMP WITH TIME ZONE DEFAULT now(),
          modified TIMESTAMP WITH TIME ZONE,
          PRIMARY KEY (id),
          CONSTRAINT fk_discount_flight
          FOREIGN KEY(discount_flight_id)
            REFERENCES discount_flight(id)
        );

      COMMIT;
    `)
  },

  down: (queryInterface) => {
    return queryInterface.sequelize.query(`
      DROP TABLE discount_flight_leg;
    `)
  },
}
