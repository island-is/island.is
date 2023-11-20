'use strict'

module.exports = {
  up: (queryInterface) => {
    return queryInterface.sequelize.query(`
      BEGIN;
        CREATE TABLE air_discount (
          id UUID NOT NULL,
          code VARCHAR NOT NULL,
          discount_flight_id UUID NOT NULL,
          comment VARCHAR,
          explicit BOOLEAN NOT NULL,
          employee_id VARCHAR,
          active BOOLEAN NOT NULL,
          is_connection_code BOOLEAN NOT NULL,
          valid_until VARCHAR NOT NULL,
          used_at VARCHAR,
          has_return_flight BOOLEAN NOT NULL,
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
      DROP TABLE air_discount;
    `)
  },
}
