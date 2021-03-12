'use strict'

module.exports = {
  up: (queryInterface) => {
    return queryInterface.sequelize.query(`
      BEGIN;

        ALTER TABLE flight ADD COLUMN is_connected BOOLEAN NOT NULL DEFAULT FALSE;

      COMMIT;
    `)
  },

  down: (queryInterface) => {
    return queryInterface.sequelize.query(`
      ALTER TABLE flight DROP COLUMN is_connected;
    `)
  },
}
