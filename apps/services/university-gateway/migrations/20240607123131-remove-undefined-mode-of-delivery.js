'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
      BEGIN TRANSACTION;

        -- Delete UNDEFINED entries if other modes exist for the same program_id
        DELETE FROM program_mode_of_delivery
          WHERE mode_of_delivery = 'UNDEFINED'
            AND program_id IN (
              SELECT program_id
              FROM program_mode_of_delivery
              GROUP BY program_id
              HAVING COUNT(*) > 1
            );

        -- Update remaining UNDEFINED entries to ON_SITE if no other modes exist for the same program_id
        UPDATE program_mode_of_delivery
          SET mode_of_delivery = 'ON_SITE'
          WHERE mode_of_delivery = 'UNDEFINED'
            AND program_id NOT IN (
              SELECT program_id
              FROM program_mode_of_delivery
              WHERE mode_of_delivery <> 'UNDEFINED'
            );

        -- Change name of existing enum
        ALTER TYPE enum_program_mode_of_delivery_mode_of_delivery RENAME TO enum_program_mode_of_delivery_mode_of_delivery_old;

        -- Create new enum based on existing enum
        CREATE TYPE enum_program_mode_of_delivery_mode_of_delivery AS ENUM ('ON_SITE', 'ONLINE', 'REMOTE', 'MIXED');

        -- Change type for mode_of_delivery column to new enum
        ALTER TABLE program_mode_of_delivery
          ALTER COLUMN mode_of_delivery
          TYPE enum_program_mode_of_delivery_mode_of_delivery
          USING mode_of_delivery::text::enum_program_mode_of_delivery_mode_of_delivery;

        -- Delete old enum
        DROP TYPE enum_program_mode_of_delivery_mode_of_delivery_old;

      COMMIT;
    `)
  },

  //Down migration will not restore entries deleted or changed in up migration.
  //Those entries should not have entered into the database in the first place.
  down(queryInterface, Sequelize) {
    return queryInterface.sequelize.query(`
      BEGIN;

        -- Change name of existing enum
        ALTER TYPE enum_program_mode_of_delivery_mode_of_delivery RENAME TO enum_program_mode_of_delivery_mode_of_delivery_old;

        -- Create new enum based on existing enum
        CREATE TYPE enum_program_mode_of_delivery_mode_of_delivery AS ENUM ('ON_SITE', 'ONLINE', 'REMOTE', 'MIXED', 'UNDEFINED');

        -- Change type for mode_of_delivery column to new enum
        ALTER TABLE program_mode_of_delivery
          ALTER COLUMN mode_of_delivery
          TYPE enum_program_mode_of_delivery_mode_of_delivery
          USING mode_of_delivery::text::enum_program_mode_of_delivery_mode_of_delivery;

        -- Delete old enum
        DROP TYPE enum_program_mode_of_delivery_mode_of_delivery_old;

      COMMIT;
    `)
  },
}
