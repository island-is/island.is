'use strict'

module.exports = {
  up: (queryInterface) => {
    return queryInterface.sequelize.query(`
      BEGIN;
        CREATE TABLE explicit_code (
          id UUID NOT NULL,
          code VARCHAR NOT NULL,
          employee_id VARCHAR NOT NULL,
          customer_id VARCHAR NOT NULL,
          comment VARCHAR NOT NULL,
          flight_id UUID,
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
      DROP TABLE explicit_code;
    `)
  },
}
