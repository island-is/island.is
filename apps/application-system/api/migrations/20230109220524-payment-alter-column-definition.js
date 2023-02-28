'use strict'

module.exports = {
  async up(queryInterface) {
    return queryInterface.sequelize.query(`
      BEGIN;
        ALTER TABLE payment ALTER COLUMN definition TYPE VARCHAR(500);
      COMMIT;
    `)
  },

  async down(queryInterface) {
    return queryInterface.sequelize.query(`
      ALTER TABLE payment ALTER COLUMN definition TYPE VARCHAR(255);
    `)
  },
}
