'use strict'

module.exports = {
  up: (queryInterface) => {
    return queryInterface.sequelize.query(`
      BEGIN;
        ALTER TABLE vehicle ADD COLUMN mileage INT;
      COMMIT;
    `)
  },

  down: (queryInterface) => {
    return queryInterface.sequelize.query(`
      ALTER TABLE vehicle DROP COLUMN mileage;
    `)
  },
}
