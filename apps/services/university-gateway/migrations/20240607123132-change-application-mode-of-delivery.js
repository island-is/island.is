'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
      BEGIN;

        -- Add new column to the application table using enum instead of foreign key
        ALTER TABLE application
          ADD COLUMN program_mode_of_delivery enum_program_mode_of_delivery_mode_of_delivery;

        -- Update the new column with the correct mode of delivery
        UPDATE application
          SET program_mode_of_delivery = mode_of_delivery FROM program_mode_of_delivery
          WHERE application.program_mode_of_delivery_id = program_mode_of_delivery.id;

        -- Set the new column to NOT NULL (need to do this after populating the column)
        ALTER TABLE application
          ALTER COLUMN program_mode_of_delivery SET NOT NULL;

        -- Drop the old column
        ALTER TABLE application
          DROP COLUMN program_mode_of_delivery_id;

      COMMIT;
    `)
  },

  down(queryInterface, Sequelize) {
    return queryInterface.sequelize.query(`
      BEGIN;

        -- Add back the old column
        ALTER TABLE application
          ADD COLUMN program_mode_of_delivery_id UUID;

        -- Populate the old column with the correct mode of delivery
        UPDATE application
          SET program_mode_of_delivery_id = program_mode_of_delivery.id FROM program_mode_of_delivery
          WHERE application.program_id = program_mode_of_delivery.program_id
            AND application.program_mode_of_delivery = program_mode_of_delivery.mode_of_delivery;

        -- Set the old column to NOT NULL (need to do this after populating the column)
        ALTER TABLE application
          ALTER COLUMN program_mode_of_delivery_id SET NOT NULL;

        -- Add the foreign key constraint (need to do this after populating the column)
        ALTER TABLE application
          ADD CONSTRAINT fk_program_mode_of_delivery
          FOREIGN KEY (program_mode_of_delivery_id)
          REFERENCES program_mode_of_delivery (id);

        -- Drop the new column
        ALTER TABLE application
          DROP COLUMN program_mode_of_delivery;

      COMMIT;
    `)
  },
}
