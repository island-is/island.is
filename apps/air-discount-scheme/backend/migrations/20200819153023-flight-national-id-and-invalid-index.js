'use strict'

module.exports = {
  up: (queryInterface) => {
    return queryInterface.sequelize.query(`
      BEGIN;

        CREATE UNIQUE INDEX national_id_and_invalid_idx ON flight (national_id, invalid);

      COMMIT;
    `)
  },

  down: (queryInterface) => {
    return queryInterface.sequelize.query(`
      DROP INDEX national_id_and_invalid_idx;
    `)
  },
}
