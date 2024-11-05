'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
      BEGIN;

        -- Add new column
        ALTER TABLE program_extra_application_field
          ADD COLUMN external_key VARCHAR(255) NOT NULL DEFAULT '';

        -- Set value in new column
        UPDATE program_extra_application_field
          SET external_key = external_id;

        -- Drop the old column
        ALTER TABLE program_extra_application_field
          DROP COLUMN external_id;

      COMMIT;
    `)
  },

  down(queryInterface, Sequelize) {
    return queryInterface.sequelize.query(`
      BEGIN;

        -- Add back the old column
        ALTER TABLE program_extra_application_field
          ADD COLUMN external_id VARCHAR(255) NOT NULL DEFAULT '';

        -- Set value in old column
        UPDATE program_extra_application_field
          SET external_id = external_key;

        -- Drop the new column
        ALTER TABLE program_extra_application_field
          DROP COLUMN external_key;

      COMMIT;
    `)
  },
}
