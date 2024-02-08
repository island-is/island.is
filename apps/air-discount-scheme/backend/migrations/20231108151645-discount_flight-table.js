'use strict'

module.exports = {
  up: (queryInterface) => {
    return queryInterface.sequelize.query(`
      BEGIN;
        CREATE TABLE discount_flight (
          id UUID NOT NULL,
          discount_id UUID NOT NULL,
          is_connection_flight BOOLEAN NOT NULL,
          created TIMESTAMP WITH TIME ZONE DEFAULT now(),
          modified TIMESTAMP WITH TIME ZONE,
          PRIMARY KEY (id),
          CONSTRAINT fk_discount
          FOREIGN KEY(discount_id)
            REFERENCES discount(id)
        );

      COMMIT;
    `)
  },

  down: (queryInterface) => {
    return queryInterface.sequelize.query(`
      DROP TABLE discount_flight;
    `)
  },
}
