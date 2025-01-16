'use strict'

module.exports = {
  async up(queryInterface) {
    return queryInterface.sequelize.transaction(async (transaction) => {
      // Drop the ENUM types if they exist
      await queryInterface.sequelize.query(
        'DROP TYPE IF EXISTS "enum_program_course_requirement";',
        { transaction },
      )
      await queryInterface.sequelize.query(
        'DROP TYPE IF EXISTS "enum_program_course_semester_season";',
        { transaction },
      )
    })
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (transaction) => {
      // Re-create the ENUM types if you need to roll back this migration
      await queryInterface.sequelize.query(
        `CREATE TYPE "enum_program_course_requirement" AS ENUM (
          'MANDATORY',
          'FREE_ELECTIVE',
          'RESTRICTED_ELECTIVE'
        );`,
        { transaction },
      )
      await queryInterface.sequelize.query(
        `CREATE TYPE "enum_program_course_semester_season" AS ENUM (
          'FALL',
          'SPRING',
          'SUMMER',
          'WHOLE_YEAR',
          'ANY'
        );`,
        { transaction },
      )
    })
  },
}
