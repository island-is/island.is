'use strict'

module.exports = {
  up: (queryInterface) => {
    return queryInterface.sequelize.query(`
      BEGIN;
        ALTER TABLE flight ADD COLUMN explicit_by VARCHAR;
      COMMIT;
    `)
  },

  down: (queryInterface) => {
    return queryInterface.sequelize.query(`
      ALTER TABLE flight DROP COLUMN explicit_by;
    `)
  },
}
