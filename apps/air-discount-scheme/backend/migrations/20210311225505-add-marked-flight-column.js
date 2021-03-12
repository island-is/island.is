'use strict'

module.exports = {
  up: (queryInterface) => {
    return queryInterface.sequelize.query(`
      BEGIN;

        ALTER TABLE flight ADD COLUMN connectable BOOLEAN NOT NULL DEFAULT TRUE;

      COMMIT;
    `)
  },

  down: (queryInterface) => {
    return queryInterface.sequelize.query(`
      ALTER TABLE flight DROP COLUMN connectable;
    `)
  },
}
