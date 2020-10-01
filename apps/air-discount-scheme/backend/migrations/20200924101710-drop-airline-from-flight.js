'use strict'

module.exports = {
  up: (queryInterface) => {
    return queryInterface.sequelize.query(`
      BEGIN;

        ALTER TABLE flight DROP COLUMN airline;

      COMMIT;
    `)
  },

  down: (queryInterface) => {
    return queryInterface.sequelize.query(`
      ALTER TABLE flight ADD COLUMN airline VARCHAR NOT NULL;
    `)
  },
}
