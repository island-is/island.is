'use strict'

module.exports = {
  async up(queryInterface) {
    return queryInterface.sequelize.query(`
      BEGIN;

        ALTER TABLE domain
          ADD COLUMN display_name VARCHAR DEFAULT 'Mínar síður Ísland.is' NOT NULL;

        ALTER TABLE domain
          ADD COLUMN organisation_logo_key VARCHAR DEFAULT 'Stafrænt Ísland' NOT NULL;
          
      COMMIT;
    `)
  },

  async down(queryInterface) {
    return queryInterface.sequelize.query(`
      BEGIN;

        ALTER TABLE domain
          DROP COLUMN display_name;

        ALTER TABLE domain
          DROP COLUMN organisation_logo_key;

      COMMIT;
    `)
  },
}
