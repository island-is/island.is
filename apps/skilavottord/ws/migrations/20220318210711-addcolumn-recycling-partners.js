'use strict'

module.exports = {
  up: (queryInterface) => {
    return queryInterface.sequelize.query(`
      BEGIN;
        ALTER TABLE recycling_partner ADD COLUMN email VARCHAR;
        ALTER TABLE recycling_partner ADD COLUMN national_id VARCHAR;
      COMMIT;
    `)
  },

  down: (queryInterface) => {
    return queryInterface.sequelize.query(`
      ALTER TABLE recycling_partner DROP COLUMN email;
      ALTER TABLE recycling_partner DROP COLUMN national_id;
    `)
  },
}
