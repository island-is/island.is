'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
        ALTER TYPE enum_program_extra_application_field_field_type ADD VALUE 'PERSON'
        `)
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
        DELETE FROM pg_enum
        WHERE enumlabel = 'PERSON'
        AND enumtypid = (
            SELECT oid FROM pg_type
            WHERE typname = 'enum_program_extra_application_field_field_type'
        )
    `)
  },
}
