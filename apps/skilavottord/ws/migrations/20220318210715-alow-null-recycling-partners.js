'use strict'

module.exports = {
  up: (queryInterface) => {
    return queryInterface.sequelize.query(`
      BEGIN;
        ALTER TABLE recycling_partner ALTER COLUMN website DROP NOT NULL;
      COMMIT;
    `)
  },

  down: (queryInterface) => {
    return queryInterface.sequelize.query(`
        ALTER TABLE recycling_partner ALTER COLUMN website SET NOT NULL;
    `)
  },
}
