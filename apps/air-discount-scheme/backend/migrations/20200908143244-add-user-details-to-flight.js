'use strict'

module.exports = {
  up: (queryInterface) => {
    return queryInterface.sequelize.query(`
      BEGIN;

        ALTER TABLE flight ADD COLUMN user_info JSONB DEFAULT '{}' NOT NULL;
        DELETE FROM flight_leg;
        DELETE FROM flight;

      COMMIT;
    `)
  },

  down: (queryInterface) => {
    return queryInterface.sequelize.query(`
        ALTER TABLE flight DROP COLUMN user_info;
    `)
  },
}
