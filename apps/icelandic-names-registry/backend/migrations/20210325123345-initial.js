'use strict'

module.exports = {
  up: (queryInterface) => {
    return queryInterface.sequelize.query(`
      BEGIN;

        CREATE TABLE icelandic_names (
          id SERIAL PRIMARY KEY,
          icelandic_name VARCHAR NOT NULL,
          status VARCHAR DEFAULT NULL,
          visible BOOLEAN DEFAULT FALSE,
          type VARCHAR DEFAULT NULL,
          description VARCHAR DEFAULT NULL,
          verdict VARCHAR DEFAULT NULL
        );

      COMMIT;
    `)
  },

  down: (queryInterface) => {
    return queryInterface.sequelize.query(`
      DROP TABLE icelandic_names;
    `)
  },
}
