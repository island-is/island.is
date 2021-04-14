'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
    BEGIN;

      ALTER TABLE delegation
      ALTER COLUMN valid_count type integer using valid_count::integer;

      COMMIT;
    `)
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
      BEGIN;
      ALTER TABLE delegation
        ALTER COLUMN valid_count type varchar using valid_count::varchar;

      COMMIT;
    `)
  },
}
